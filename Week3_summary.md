
# 📊 Weekly Summary Report – Week 3
### Theme: Performance and Security Testing  
**Duration:** Day 13 – Day 18

---

## 🔹 Day 13: Introduction to Performance Testing with k6

**Key Activities:**
- Read the course material and watched the tutorial video: *How to do Performance Testing with k6*.
- Installed and set up `k6` on the local machine.
- Wrote a basic load test script targeting an API endpoint.

**Script Location:**  
`tests/performance/load_test.js`

**Output Captured:**  
- Screenshot of `k6` CLI output showing request duration, checks, VUs, and iterations.

**Reflection:**  
This was my first exposure to `k6`. The CLI tool was intuitive, and scripting in JavaScript made it easier to simulate virtual users (VUs). The concept of simulating load helped me understand the importance of testing APIs under stress before production release.

---

## 🔹 Day 14: Advanced Load Testing Scenarios

**Key Activities:**
- Extended the test script to include:
  - **Ramp-up** (gradually increase users)
  - **Ramp-down** (gradually decrease users)
- Used `stages` configuration to simulate realistic traffic behavior.
- Incorporated checks to validate expected API responses under load.

**Script Updated:**  
- `load_test.js` was updated with multiple stages and error thresholds.

**Output Captured:**  
- Screenshot of enhanced test results including failure percentages, response times, and system behavior during ramp-up/down.

**Reflection:**  
Simulating traffic spikes felt more realistic and helped visualize how a backend service might struggle under pressure. This exposed the importance of thresholds and graceful degradation.

---

## 🔹 Day 15: Analyzing Performance Test Results

**Key Activities:**
- Interpreted the metrics from the `k6` test:
  - Requests/sec
  - Response time (avg, min, max, p(90), p(95))
  - Failures
  - Error Rate

**Deliverable Created:**  
- **Performance Analysis Report** documenting:
  - Metrics observed
  - Bottlenecks and anomalies
  - Suggested improvements

**Reflection:**  
I learned how to read the test report like a backend engineer or QA. Recognizing the difference between 95th percentile and average helped me frame realistic performance goals.

---

## 🔹 Day 16: Introduction to OWASP ZAP

**Key Activities:**
- Set up **OWASP ZAP** using TryHackMe's guided module.
- Performed a **basic spider scan** and **active scan** on a test application.
- Observed alerts on issues such as missing security headers, input forms with insecure configurations, etc.

**Deliverables:**  
- ZAP scan report (HTML/JSON)  
- Screenshot of scan results and findings

**Reflection:**  
This was my first hands-on with a **security scanner**. OWASP ZAP helped surface issues that would be easy to miss otherwise. I found it fascinating how many vulnerabilities were detected without even logging in.

---

## 🔹 Day 17: Identifying and Fixing Vulnerabilities

**Key Activities:**
- Reviewed alerts from ZAP (e.g., XSS possibilities, insecure cookies).
- Implemented fixes in the app:
  - Added CSP and security headers
  - Set secure flags on cookies
  - Escaped user inputs in forms
- Re-ran scans to validate that vulnerabilities were fixed.

**Deliverables:**  
- Updated source code with applied fixes  
- Summary of vulnerabilities and how they were mitigated

**Reflection:**  
Security became practical for me this day. I understood how minor code changes (e.g., sanitizing input) can significantly improve application safety.

---

## 🔹 Day 18: Review and Assessment

**Key Activities:**
- Consolidated work done throughout the week.
- Prepared a comprehensive **summary report** of:
  - Load testing setup
  - Advanced test scenario outcomes
  - Performance analysis
  - OWASP ZAP setup
  - List of vulnerabilities and fixes
- Took the video assessment (if applicable)
- Committed all files, reports, and screenshots to the GitHub repository.

**Deliverables:**  
- Final Summary Report (this document)  
- All scripts, screenshots, and reports organized and committed  
- [Assessment URL] completed

**Reflection:**  
This review helped me reflect on the transformation from being unaware of performance/security tools to confidently using them to test and improve an application. It felt rewarding to see measurable improvements after implementing fixes and rerunning scans.

---

## ✅ Key Skills Acquired
- Performance Testing using `k6`
- Analyzing test results and interpreting metrics
- Setting realistic user scenarios via ramp-up/down
- Web vulnerability scanning with OWASP ZAP
- Fixing security issues (headers, cookies, input sanitization)
- Writing test scripts and reports with clarity
- Structuring commits for traceability
"""

