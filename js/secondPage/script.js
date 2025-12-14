document.addEventListener("DOMContentLoaded", () => {
  // Set user's initial in the dropdown button
  const userName = "Zohn Doe"; // Replace with actual user name
  const userInitial = userName.charAt(0).toUpperCase();
  document.getElementById("userInitial").innerText = userInitial; // New code

  const urlParams = new URLSearchParams(window.location.search);
  const selectedGradeFromURL = urlParams.get('grade');
  // Initialize subject and grade buttons and dynamic text
  const dynamicText = document.getElementById("dynamic-text");
  const subjectNav = document.getElementById("subject-nav");
  const sidebar = document.getElementById("sidebar");
  const content = document.querySelector(".content");

  let selectedGrade = "";
  let selectedSubject = "";
  let jsonData = null;

  function setActive(buttons, clickedButton) {
    buttons.forEach((button) => button.classList.remove("active"));
    if (clickedButton) {
      clickedButton.classList.add("active");
    }
  }

  function updateDynamicText() {
    if (selectedGrade && selectedSubject) {
      dynamicText.innerText = `You have selected ${selectedGrade} and ${selectedSubject}.`;
    } else if (selectedGrade) {
      dynamicText.innerText = `You have selected ${selectedGrade}. Please select a subject.`;
    } else if (selectedSubject) {
      dynamicText.innerText = `You have selected ${selectedSubject}. Please select a grade.`;
    } else {
      dynamicText.innerText = "Please select a grade or subject.";
    }
  }

  function addCheckboxListeners() {
    document.querySelectorAll(".custom-checkbox").forEach((checkbox) => {
      checkbox.addEventListener("click", function () {
        let clicks = parseInt(this.getAttribute("data-clicks"));

        if (clicks === 0) {
          this.classList.add("gray");
          this.setAttribute("data-clicks", "1");
        } else if (clicks === 1) {
          this.classList.remove("gray");
          this.classList.add("green");
          this.setAttribute("data-clicks", "2");
        } else {
          this.classList.remove("green");
          this.setAttribute("data-clicks", "0");
        }
      });
    });
  }

  function loadGrades() {
    sidebar.innerHTML = "";
    jsonData.grades.forEach((grade) => {
      const gradeButton = document.createElement("button");
      gradeButton.classList.add("grade", "gradeColor");
      gradeButton.textContent = grade.grade_name;
      sidebar.appendChild(gradeButton);

      gradeButton.addEventListener("click", function () {
        const gradeObj = jsonData.grades.find(g => g.grade_name === grade.grade_name);
        const urlParams = new URLSearchParams(window.location.search);
        const currentGrade = urlParams.get('grade');
        if (gradeObj && String(gradeObj.grade_id) !== String(currentGrade)) {
          history.pushState(null, '', '/src/Home/index.html?grade=' + gradeObj.grade_id);
          setActive(document.querySelectorAll('.sidebar .gradeColor'), this);
          selectedGrade = gradeObj.grade_name;
          loadSubjects(gradeObj.subjects);
          updateDynamicText();
        }
      });
    });

    // Highlight grade from URL if present, otherwise default to first
    const urlParams = new URLSearchParams(window.location.search);
    const gradeParam = urlParams.get('grade');
    let gradeToSelect = null;
    if (gradeParam) {
      gradeToSelect = jsonData.grades.find(g => String(g.grade_id) === String(gradeParam));
    }
    if (gradeToSelect) {
      // Find the corresponding sidebar button and simulate click
      const gradeButtons = document.querySelectorAll('.sidebar .gradeColor');
      gradeButtons.forEach(btn => {
        if (btn.textContent.trim() === gradeToSelect.grade_name) {
          btn.classList.add('active');
          selectedGrade = gradeToSelect.grade_name;
          loadSubjects(gradeToSelect.subjects);
          updateDynamicText();
        } else {
          btn.classList.remove('active');
        }
      });
    } else {
      // Default to first grade
      const gradeButtons = document.querySelectorAll('.sidebar .gradeColor');
      if (gradeButtons.length > 0) {
        setActive(gradeButtons, gradeButtons[0]);
        selectedGrade = jsonData.grades[0].grade_name;
        loadSubjects(jsonData.grades[0].subjects);
        updateDynamicText();
      }
    }
  }

  function loadSubjects(subjects) {
    subjectNav.innerHTML = "";
    subjects.forEach((subject) => {
      const subjectButton = document.createElement("button");
      subjectButton.classList.add("grade");
      subjectButton.textContent = subject.subject_name;
      subjectNav.appendChild(subjectButton);

      subjectButton.addEventListener("click", function () {
        setActive(subjectButtons, this);
        selectedSubject = this.innerText;
        loadSkillCategories(subject.skill_categories);
        updateDynamicText();
      });
    });

    const subjectButtons = document.querySelectorAll(".top-nav .grade");
    if (subjectButtons.length > 0) {
      setActive(subjectButtons, subjectButtons[0]);
      selectedSubject = subjectButtons[0].innerText;
      loadSkillCategories(subjects[0].skill_categories);
      updateDynamicText();
    }
  }

  function loadSkillCategories(skillCategories) {
    content.innerHTML = "";
    skillCategories.forEach((skillCategory) => {
      const skillCategoryDiv = document.createElement("div");
      skillCategoryDiv.classList.add("category");
      const skillsList = skillCategory.skills
        .map(
          (skill) => `
          <li class="subtopic-item">
            <span class="subtopic-text">${skill}</span>
            <input type="checkbox" class="custom-checkbox" data-clicks="0" />
          </li>
        `
        )
        .join("");
      skillCategoryDiv.innerHTML = `
        <h2 class="${skillCategory.skill_category.toLowerCase().replace(/\s+/g, '-')}">
          <img
            src="/assets/images/4.png"
            alt="${skillCategory.skill_category} Icon"
            style="
              width: 50px;
              height: 50px;
              margin-right: 8px;
              vertical-align: middle;
            "
          />
          ${skillCategory.skill_category}
        </h2>
        <ul>
          ${skillsList}
        </ul>
      `;
      content.appendChild(skillCategoryDiv);
    });
    addCheckboxListeners();
  }

  // Function to handle signing out
  function signOut(event) {
    event.preventDefault();
    // Clear any user session data from localStorage
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("selectedUserType");
    localStorage.removeItem("selectedUserTypeIcon");
    
    // Redirect to the home page
    window.location.href = "../../indexs.html";
  }

  // Function to calculate total questions for a subject (sum of subtopics)
  function getTotalQuestions(subject) {
    let total = 0;
    subject.skill_categories.forEach(skillCategory => {
      total += skillCategory.skills.length;
    });
    return total;
  }

  // Function to populate grade cards with subject list and question counts
  function populateGradeCards() {
    console.log("Populating grade cards with subjects:");
    jsonData.grades.forEach(grade => {
      console.log(`Grade: ${grade.grade_name}, Subjects: ${grade.subjects.map(s => s.subject_name).join(", ")}`);
      // Find the grade card element by matching grade name or class
      // Grade card classes are like 'grade1', 'grade2', etc.
      const gradeClass = grade.grade_name.toLowerCase().replace(/\s+/g, '');
      const gradeCard = document.querySelector(`.grade-card.${gradeClass}`);
      if (gradeCard) {
        const subjectListContainer = gradeCard.querySelector('.grade-subject-list');
        if (subjectListContainer) {
          subjectListContainer.innerHTML = ''; // Clear existing content
          grade.subjects.forEach(subject => {
            const questionCount = getTotalQuestions(subject);
            const subjectItem = document.createElement('div');
            subjectItem.classList.add('subject-item');
            subjectItem.innerHTML = `
              <span class="subject-name">${subject.subject_name}</span>
              <span class="question-count">${questionCount}</span>
            `;
            subjectListContainer.appendChild(subjectItem);
          });
        }
      }
    });
  }

  // Highlight sidebar grade button based on URL parameter
  document.addEventListener('DOMContentLoaded', function() {
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }
    const gradeParam = getQueryParam('grade');
    if (gradeParam) {
        // Normalize grade param
        const grade = gradeParam.toString().toUpperCase();
        // Map grade param to sidebar button selector
        let btnSelector = '';
        if (grade === 'K') {
            btnSelector = '.grade-btn.pre-k';
        } else if (grade === '1') {
            btnSelector = '.grade-btn.grade-1';
        } else if (grade === '2') {
            btnSelector = '.grade-btn.grade-2';
        } else if (grade === '3') {
            btnSelector = '.grade-btn.grade-3';
        } else if (grade === '4') {
            btnSelector = '.grade-btn.grade-4';
        } else if (grade === '5') {
            btnSelector = '.grade-btn.grade-5';
        }
        if (btnSelector) {
            // Remove highlight from all grade buttons
            document.querySelectorAll('.grade-btn').forEach(btn => {
                btn.classList.remove('active', 'selected', 'highlight');
            });
            // Add highlight to the selected button
            const btn = document.querySelector(btnSelector);
            if (btn) {
                btn.classList.add('active');
                btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Optionally trigger click if your UI logic requires it
                // btn.click();
            } else {
                console.log('Grade button not found for selector:', btnSelector);
            }
        }
    }
});

    // Add global click handler for skill (subtopic-item) navigation
  document.body.addEventListener('click', function(e) {
    let subtopicBtn = e.target.closest('.subtopic-item');
    if (subtopicBtn) {
      // Navigate to the actual test page present in the repo
      window.location.href = '/pages/tests/test-main.html';
      e.preventDefault();
      return false;
    }
  });

  // Fetch grades/subjects/topics/subtopics data from external JSON
  fetch('/data/grades/gradesData.json')
    .then(response => response.json())
    .then(data => {
      jsonData = data;
      loadGrades();
      populateGradeCards();
    });
});
