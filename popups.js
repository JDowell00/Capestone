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
    



    
