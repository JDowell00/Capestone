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
