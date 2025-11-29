document.addEventListener("DOMContentLoaded", function() {
    let selectedGrade = '';
    let selectedSubject = '';
  
    function updateDynamicText() {
      if (selectedGrade && selectedSubject) {
        document.getElementById("dynamic-text").innerText = `You have selected ${selectedGrade} and ${selectedSubject}.`;
      } else if (selectedGrade) {
        document.getElementById("dynamic-text").innerText = `You have selected ${selectedGrade}. Please select a subject.`;
      } else if (selectedSubject) {
        document.getElementById("dynamic-text").innerText = `You have selected ${selectedSubject}. Please select a grade.`;
      } else {
        document.getElementById("dynamic-text").innerText = "Please select a grade or subject.";
      }
    }
  
    const grades = document.querySelectorAll(".sidebar .grade");
    grades.forEach(grade => {
      grade.addEventListener("click", function() {
        selectedGrade = this.innerText;
        updateDynamicText();
      });
    });
  
    const subjects = document.querySelectorAll(".top-nav .grade");
    subjects.forEach(subject => {
      subject.addEventListener("click", function() {
        selectedSubject = this.innerText;
        updateDynamicText();
      });
    });
  });