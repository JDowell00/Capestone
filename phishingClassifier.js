/**
 * Analyze a block of email text and return a score, level, and reasons.
 * @param {string} rawText
 * @returns {{ score: number, level: 'low' | 'medium' | 'high', reasons: string[] }}
 */
function analyzeEmailText(rawText) {
  const text = (rawText || '').toLowerCase();
  const reasons = [];
  let score = 0;

  if (!text.trim()) {
    return { score: 0, level: 'low', reasons: ['No text provided.'] };
  }

  const add = (points, reason) => {
    score += points;
    reasons.push(reason);
  };

  // Common phishing phrases / social engineering
  const phraseRules = [
    { p: 18, re: /(verify|update|confirm)\s+(your\s+)?account/ },
    { p: 16, re: /(suspend(ed)?|disable(d)?|locked)\s+your\s+account/ },
    { p: 14, re: /(unusual|suspicious)\s+(activity|login)/ },
    { p: 12, re: /(log\s?in|sign\s?in)\s+to\s+avoid/ },
    { p: 10, re: /password\s+expires?|reset\s+your\s+password/ },
    { p: 10, re: /unauthorized\s+(access|transaction)/ },
    { p: 8, re: /(verify|confirm)\s+your\s+identity/ },
    { p: 8, re: /(bank|paypal|payment|invoice)\s+issue/ }
  ];

  phraseRules.forEach(rule => {
    if (rule.re.test(text)) {
      add(rule.p, `Contains high-risk phrase: "${rule.re.source.replace(/\\s\+/g, ' ')}"`);
    }
  });

  // Urgency and pressure
  const urgencyMatches = (text.match(/\b(urgent|immediately|right away|asap|within\s+\d+\s+(hours?|days?))\b/g) || []).length;
  if (urgencyMatches >= 1) {
    add(10, 'Uses urgent language to pressure quick action.');
  }
  if (urgencyMatches >= 3) {
    add(6, 'Multiple urgency cues throughout the message.');
  }

  // Requests for sensitive data
  const sensitivePatterns = [
    { p: 18, re: /(credit\s*card|debit\s*card|card\s+number|cvv|cvc|security\s+code)/ },
    { p: 18, re: /(ssn|social\s+security\s+number|national\s+id)/ },
    { p: 16, re: /(password|passcode|pin\s+code?)/ },
    { p: 12, re: /(bank\s+details|routing\s+number|iban|swift)/ },
    { p: 10, re: /one[-\s]?time\s+password|otp/ }
  ];
  sensitivePatterns.forEach(rule => {
    if (rule.re.test(text)) {
      add(rule.p, 'Asks for highly sensitive personal or financial information.');
    }
  });

  // Links analysis (very approximate but helpful)
  const urlRegex = /\bhttps?:\/\/[^\s)>"']+/gi;
  const urls = (rawText.match(urlRegex) || []);

  if (urls.length > 3) {
    add(5, 'Contains many links, which can be used to redirect you to malicious sites.');
  }





urls.forEach(url => {
    try {
      const u = new URL(url);
      const host = u.hostname.toLowerCase();

      if (host.startsWith('xn--')) {
        add(16, `Uses punycode domain (${host}), which can impersonate legitimate sites.`);
      }

      if (suspiciousDomains.some(d => host === d || host.endsWith(`.${d}`))) {
        add(12, `Uses a link shortener (${host}), which can hide the real destination.`);
      }

            // Generic look‑alike domain hints
      if (/(paypa1|paypaI|app1e|m1crosoft|microsoft\-secure|security\-login)/.test(host)) {
        add(20, `Domain name (${host}) looks similar to a well-known brand — possible impersonation.`);
      }
    } catch {
      // ignore invalid URLs
    }


 }); 



  // Poor writing style can be an indicator (but not always)
  const exclamationCount = (text.match(/!/g) || []).length;
  if (exclamationCount >= 3) {
    add(5, 'Uses excessive exclamation marks, which can be a phishing red flag.');
  }

  const allCapsWords = (rawText.match(/\b[A-Z]{4,}\b/g) || []).length;
  if (allCapsWords >= 3) {
    add(4, 'Contains many ALL‑CAPS words, which can indicate a scammy tone.');
  }

  // Very short + very high pressure + link → strong suspicion
  const wordCount = (rawText.match(/\b\w+\b/g) || []).length;
  if (wordCount < 40 && urgencyMatches > 0 && urls.length > 0) {
    add(10, 'Short message with urgency and a link — common pattern in phishing emails.');
  }

  // Lower private / friendly indicators slightly (but never below zero)
  if (/^hi\s+[a-z]+/i.test(rawText) || /dear\s+[a-z]+/i.test(rawText)) {
    score -= 4;
    reasons.push('Has a personal greeting, which is more typical of legitimate email (but not guaranteed).');
  }

  if (score < 0) score = 0;
  if (score > 100) score = 100;

  let level = 'low';
  if (score >= 35 && score < 70) level = 'medium';
  if (score >= 70) level = 'high';

  if (reasons.length === 0) {
    reasons.push('No obvious phishing indicators found. Still be careful with links and attachments.');
  }

  return { score, level, reasons };
}

// Expose a safe global for the popup script.
window.PhishingDetector = {
  analyzeEmailText
};

