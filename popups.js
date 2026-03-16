/* global chrome, PhishingDetector */

const emailTextEl = document.getElementById('emailText');
const analyzeBtn = document.getElementById('analyzeBtn');
const useSelectionBtn = document.getElementById('useSelectionBtn');
const clearBtn = document.getElementById('clearBtn');

const riskPill = document.getElementById('riskPill');
const scoreLabel = document.getElementById('scoreLabel');
const summaryLabel = document.getElementById('summaryLabel');
const reasonsEl = document.getElementById('reasons');
const riskBadge = document.getElementById('riskBadge');

function setRiskLevel(level, score, reasons) {
  riskPill.classList.remove('safe', 'warning', 'danger');
  let label = 'Unknown';
  let summary = '';
  let badgeText = '';
  let badgeClass = 'safe';

  if (level === 'low') {
    riskPill.classList.add('safe'):
    label = 'low risk';
    summary = 'No obvious phishing patterns detected, but always stay cautious.';
    badgeText = 'low';
    badgeClass = 'safe';
else if (level === 'medium') {
    riskPill.classList.add('warning');
    label = 'Medium risk';
    summary = 'Some phishing indicators present. Double‑check sender and links.';
    badgeText = 'medium';
    badgeClass = 'warning';
   } else if (level === 'high') {
    riskPill.classList.add('danger');
    label = 'High risk';
    summary = 'Strong phishing signals. Do not click links or share information.';
    badgeText = 'high';
    badgeClass = 'danger';





  


riskPill.textContent = label;
  scoreLabel.textContent = `Score: ${score} / 100`;
  summaryLabel.textContent = summary;

  riskBadge.innerHTML = `Overall risk: <span class="${badgeClass}">${badgeText}</span>`;

  reasonsEl.innerHTML = '';
  (reasons || []).forEach(reason => {
    const row = document.createElement('div');
    row.className = 'reason-item';
    row.innerHTML = `<div class="reason-dot"></div><div>${reason}</div>`;
    reasonsEl.appendChild(row);
  });
}

function runAnalysis() {
  const text = emailTextEl.value || '';
  const { score, level, reasons } = PhishingDetector.analyzeEmailText(text);
  setRiskLevel(level, score, reasons);

  if (chrome && chrome.storage && chrome.storage.local) {
    chrome.storage.local.set({ lastAnalysis: { text, score, level, reasons, at: Date.now() } });
  }
}

async function useSelectionFromPage() {
  if (!chrome || !chrome.tabs || !chrome.scripting) {
    return;
  }

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) return;

    const [{ result: selectionText = '' } = {}] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection ? String(window.getSelection()) : ''
    });

    if (!selectionText.trim()) {
      summaryLabel.textContent = 'No text selected on the page. Highlight the email text first, then try again.';
      return;
    }

    emailTextEl.value = selectionText;
    runAnalysis();
  } catch (err) {
    console.error('Error getting selection from page', err);
    summaryLabel.textContent = 'Could not read selection from this page.';
  }
}

function clearAll() {
  emailTextEl.value = '';
  riskPill.classList.remove('warning', 'danger');
  riskPill.classList.add('safe');
  riskPill.textContent = 'Waiting';
  scoreLabel.textContent = 'Score: – / 100';
  summaryLabel.textContent = 'Paste an email to get a risk assessment.';
  reasonsEl.innerHTML = '';
  riskBadge.innerHTML = 'Overall risk: <span class="safe">none yet</span>';
}

analyzeBtn.addEventListener('click', runAnalysis);
useSelectionBtn.addEventListener('click', useSelectionFromPage);
clearBtn.addEventListener('click', clearAll);

document.addEventListener('DOMContentLoaded', () => {
  if (chrome && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get('lastAnalysis', data => {
      const last = data && data.lastAnalysis;
      if (!last || !last.text) return;
      emailTextEl.value = last.text;
      setRiskLevel(last.level, last.score, last.reasons);
    });
  }
});


    
