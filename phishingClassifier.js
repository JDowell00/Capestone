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
