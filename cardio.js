const formData = {};
function predictHeartDisease(data) {
    let riskScore = 0;

    // Age factor (0-20 points)
    if (data.age > 70) riskScore += 20;
    else if (data.age > 60) riskScore += 15;
    else if (data.age > 50) riskScore += 10;
    else if (data.age > 40) riskScore += 5;

    // Sex factor (0-10 points) - males have higher risk
    if (data.sex === 1) riskScore += 10;
    else riskScore += 5;

    // Chest pain factor (0-15 points)
    if (data.cp === 0) riskScore += 4; // Asymptomatic is concerning
    else if (data.cp === 3) riskScore += 8; // Typical angina
    else if (data.cp === 1) riskScore += 12;
    else riskScore += 15;

    // Blood pressure (0-10 points)
    if (data.trestbps > 160) riskScore += 10;
    else if (data.trestbps > 140) riskScore += 7;
    else if (data.trestbps > 130) riskScore += 4;

    // Cholesterol (0-10 points)
    if (data.chol >= 280) riskScore += 10;   // Very high risk
    else if (data.chol >= 240) riskScore += 7; // High risk
    else if (data.chol >= 200) riskScore += 4; // Borderline high
    else riskScore += 2; // Normal or low cholesterol = minimal risk

    // Fasting blood sugar (0-5 points)
    if (data.fbs === 1) riskScore += 5;

    // Resting ECG (0-10 points)
    if (data.restecg === 2) riskScore += 10; // LV hypertrophy
    else if (data.restecg === 1) riskScore += 6;

    // Max heart rate (0-8 points)
    const maxHRExpected = 220 - data.age;
    const hrPercentage = (data.thalach / maxHRExpected) * 100;
    if (hrPercentage < 50) riskScore += 8;    // Very poor (dangerous)
    else if (hrPercentage < 60) riskScore += 6; // Poor
    else if (hrPercentage < 70) riskScore += 4; // Below average
    else if (hrPercentage < 80) riskScore += 2; // Slightly low
    else riskScore += 0; // Normal or good response

    // Exercise induced angina (0-8 points)
    if (data.exang === 1) riskScore += 8;

    // Oldpeak (0-8 points)
    if (data.oldpeak > 3) riskScore += 8;
    else if (data.oldpeak > 2) riskScore += 6;
    else if (data.oldpeak > 1) riskScore += 4;
    else if (data.oldpeak > 0) riskScore += 2;

    // Slope (0-6 points)
    if (data.slope === 0) riskScore += 6; // Downsloping
    else if (data.slope === 1) riskScore += 3; // Flat

    // Number of vessels (0-12 points)
    riskScore += data.ca * 4;

    // Thalassemia (0-10 points)
    if (data.thal === 3) riskScore += 10; // Reversible defect
    else if (data.thal === 2) riskScore += 6; // Fixed defect

    // Normalize to 0-100 scale
    const maxPossibleScore = 132;
    const percentage = Math.min(Math.round((riskScore / maxPossibleScore) * 100), 99);

    return percentage;
}

function getRiskCategory(percentage) {
    if (percentage < 40) return 'low';
    if (percentage < 70) return 'medium';
    return 'high';
}

function getTipsForRiskLevel(riskLevel, data) {
    const tipsLow = [
        {
            title: '🥗 Maintain Healthy Diet',
            desc: 'Continue eating plenty of fruits, vegetables, whole grains, and lean proteins. Limit saturated fats, trans fats, and sodium.'
        },
        {
            title: '🏃 Stay Active',
            desc: 'Aim for at least 150 minutes of moderate aerobic activity per week. Regular exercise keeps your heart strong.'
        },
        {
            title: '😴 Quality Sleep',
            desc: 'Get 7-9 hours of quality sleep each night. Good sleep is essential for heart health.'
        },
        {
            title: '🧘 Stress Management',
            desc: 'Practice stress-reduction techniques like meditation, yoga, or deep breathing exercises.'
        },
        {
            title: '✅ Regular Checkups',
            desc: 'Continue annual health checkups to monitor your cardiovascular health and catch any changes early.'
        }
    ];

    const tipsMedium = [
        {
            title: '⚠️ Consult Your Doctor',
            desc: 'Schedule an appointment with your healthcare provider to discuss your results and create a personalized prevention plan.'
        },
        {
            title: '🥗 Improve Your Diet',
            desc: 'Adopt a heart-healthy diet like the Mediterranean or DASH diet. Reduce sodium intake to less than 2,300mg per day.'
        },
        {
            title: '🏋️ Increase Physical Activity',
            desc: 'Work up to 30 minutes of moderate exercise most days. Start slowly and gradually increase intensity.'
        },
        {
            title: '⚖️ Weight Management',
            desc: 'If overweight, losing even 5-10% of body weight can significantly reduce heart disease risk.'
        },
        {
            title: '🚭 Quit Smoking',
            desc: 'If you smoke, quitting is the single best thing you can do for your heart. Seek support programs.'
        },
        {
            title: '💊 Monitor Health Metrics',
            desc: 'Regularly check blood pressure, cholesterol, and blood sugar. Take prescribed medications as directed.'
        }
    ];

    const tipsHigh = [
        {
            title: '🚨 URGENT: See a Cardiologist',
            desc: 'Schedule an appointment with a cardiologist immediately. Your risk level requires professional medical evaluation and intervention.'
        },
        {
            title: '💊 Medication Adherence',
            desc: 'If prescribed medications for blood pressure, cholesterol, or diabetes, take them exactly as directed. Never skip doses.'
        },
        {
            title: '🥗 Strict Dietary Changes',
            desc: 'Work with a nutritionist to create a strict heart-healthy meal plan. Eliminate trans fats, limit saturated fats to 5-6%, and reduce sodium significantly.'
        },
        {
            title: '🚭 Immediate Smoking Cessation',
            desc: 'If you smoke, quit immediately. Ask your doctor about smoking cessation programs and medications.'
        },
        {
            title: '🏃 Supervised Exercise Program',
            desc: 'Start a cardiac rehabilitation or supervised exercise program. Do not begin intense exercise without medical clearance.'
        },
        {
            title: '📊 Frequent Monitoring',
            desc: 'Monitor blood pressure daily, track symptoms, and have regular follow-ups with your healthcare team.'
        },
        {
            title: '👨‍👩‍👧‍👦 Family Support',
            desc: 'Inform family members about your risk level. Create an emergency plan and ensure they know warning signs of heart attack.'
        }
    ];

    if (riskLevel === 'low') return tipsLow;
    if (riskLevel === 'medium') return tipsMedium;
    return tipsHigh;
}

function displayResults(percentage, riskLevel, data) {
    const resultsCard = document.getElementById('resultsCard');
    const riskScore = document.getElementById('riskScore');
    const riskPercentage = document.getElementById('riskPercentage');
    const riskLabel = document.getElementById('riskLabel');
    const tipsSection = document.getElementById('tipsSection');

    // Update risk score
    riskPercentage.textContent = percentage + '%';

    if (riskLevel === 'low') {
        riskLabel.textContent = 'Low Risk';
        riskScore.className = 'risk-score low';
    } else if (riskLevel === 'medium') {
        riskLabel.textContent = 'Medium Risk';
        riskScore.className = 'risk-score medium';
    } else {
        riskLabel.textContent = 'High Risk';
        riskScore.className = 'risk-score high';
    }

    // Display prevention tips
    const tips = getTipsForRiskLevel(riskLevel, data);
    let tipsHTML = '<h3>Personalized Prevention Tips</h3>';
    tips.forEach(tip => {
        tipsHTML += `
                    <div class="tip-item">
                        <h4>${tip.title}</h4>
                        <p>${tip.desc}</p>
                    </div>
                `;
    });
    tipsSection.innerHTML = tipsHTML;

    // Display comparison chart
    displayChart(data);

    // Show results
    resultsCard.classList.add('active');
    resultsCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function displayChart(data) {
    const chartBars = document.getElementById('chartBars');
    const charts = [
        {
            label: 'Blood Pressure',
            value: data.trestbps,
            max: 200,
            healthy: 120,
            unit: 'mm Hg'
        },
        {
            label: 'Cholesterol',
            value: data.chol,
            max: 400,
            healthy: 200,
            unit: 'mg/dl'
        },
        {
            label: 'Max Heart Rate',
            value: data.thalach,
            max: 220,
            healthy: 220 - data.age,
            unit: 'bpm'
        },
        {
            label: 'ST Depression',
            value: data.oldpeak,
            max: 6,
            healthy: 0,
            unit: ''
        }
    ];

    let chartHTML = '';
    charts.forEach(chart => {
        const percentage = (chart.value / chart.max) * 100;
        const healthyPercentage = (chart.healthy / chart.max) * 100;
        const isWarning = chart.value > chart.healthy * 1.2;
        const isDanger = chart.value > chart.healthy * 1.5;

        let barClass = '';
        if (isDanger) barClass = 'danger';
        else if (isWarning) barClass = 'warning';

        chartHTML += `
                    <div class="chart-bar">
                        <div class="chart-bar-label">
                            <span>${chart.label}</span>
                            <span>Your: ${chart.value}${chart.unit} | Target: ${chart.healthy}${chart.unit}</span>
                        </div>
                        <div class="chart-bar-track">
                            <div class="chart-bar-fill ${barClass}" style="width: ${percentage}%">
                                ${chart.value}${chart.unit}
                            </div>
                        </div>
                    </div>
                `;
    });

    chartBars.innerHTML = chartHTML;
}

function downloadReport() {
    const reportContent = `
═══════════════════════════════════════════════════
                    HEARTSAFE REPORT
                Heart Disease Risk Assessment
═══════════════════════════════════════════════════

Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

PATIENT INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Age: ${formData.age} years
Sex: ${formData.sex === 1 ? 'Male' : 'Female'}
Chest Pain Type: ${['Asymptomatic', 'Atypical Angina', 'Non-Anginal Pain', 'Typical Angina'][formData.cp]}

VITAL SIGNS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Resting Blood Pressure: ${formData.trestbps} mm Hg
Serum Cholesterol: ${formData.chol} mg/dl
Fasting Blood Sugar > 120: ${formData.fbs === 1 ? 'Yes' : 'No'}
Maximum Heart Rate: ${formData.thalach} bpm

CARDIAC TESTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Resting ECG: ${['Normal', 'ST-T Wave Abnormality', 'LV Hypertrophy'][formData.restecg]}
Exercise Induced Angina: ${formData.exang === 1 ? 'Yes' : 'No'}
ST Depression (Oldpeak): ${formData.oldpeak}
ST Slope: ${['Downsloping', 'Flat', 'Upsloping'][formData.slope]}
Major Vessels: ${formData.ca}
Thalassemia: ${['', 'Normal', 'Fixed Defect', 'Reversible Defect'][formData.thal]}

RISK ASSESSMENT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Risk Score: ${document.getElementById('riskPercentage').textContent}
Risk Level: ${document.getElementById('riskLabel').textContent}

RECOMMENDATIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${getTipsForRiskLevel(getRiskCategory(predictHeartDisease(formData)), formData).map((tip, i) => `${i + 1}. ${tip.title}\n   ${tip.desc}`).join('\n\n')}

═══════════════════════════════════════════════════
DISCLAIMER: This report provides an educational risk 
assessment. It is NOT a substitute for professional 
medical advice. Consult a qualified healthcare 
provider regarding your heart health.
═══════════════════════════════════════════════════

Generated by HeartSafe - AI-Powered Heart Health Assessment
            `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HeartSafe-Report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('Report downloaded! Note: This is a text format. For full PDF functionality, you would need to integrate a library like jsPDF in a production environment.');
}

function resetForm() {
    document.getElementById('heartForm').reset();
    document.getElementById('resultsCard').classList.remove('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('heartForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Collect form data
    formData.age = parseInt(document.getElementById('age').value);
    formData.sex = parseInt(document.getElementById('sex').value);
    formData.cp = parseInt(document.getElementById('cp').value);
    formData.trestbps = parseInt(document.getElementById('trestbps').value);
    formData.chol = parseInt(document.getElementById('chol').value);
    formData.fbs = parseInt(document.getElementById('fbs').value);
    formData.restecg = parseInt(document.getElementById('restecg').value);
    formData.thalach = parseInt(document.getElementById('thalach').value);
    formData.exang = parseInt(document.getElementById('exang').value);
    formData.oldpeak = parseFloat(document.getElementById('oldpeak').value);
    formData.slope = parseInt(document.getElementById('slope').value);
    formData.ca = parseInt(document.getElementById('ca').value);
    formData.thal = parseInt(document.getElementById('thal').value);

    // Predict risk
    const percentage = predictHeartDisease(formData);
    const riskLevel = getRiskCategory(percentage);

    // Display results
    displayResults(percentage, riskLevel, formData);
});