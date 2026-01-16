document.getElementById('cvForm').addEventListener('submit', async e => {
  e.preventDefault();

  const generateBtn = document.getElementById('generateBtn');
  const loading = document.getElementById('loading');
  const editorArea = document.getElementById('editorArea');

  generateBtn.disabled = true;
  loading.classList.remove('hidden');
  editorArea.classList.add('hidden');

  const formData = new FormData();
  formData.append('cv', document.getElementById('cvFile').files[0]);
  formData.append('jd', document.getElementById('jobDesc').value);
  formData.append('model', document.getElementById('aiModel').value);

  try {
    const res = await fetch('/.netlify/functions/generate', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('Server Error');

    const data = await res.json();

    // Populate Fields
    document.getElementById('editName').value = data.NAME || '';
    document.getElementById('editContact').value = data.CONTACT || '';
    document.getElementById('editHeadline').value = data.HEADLINE || '';

    document.getElementById('editSummary').value = data.SUMMARY || '';
    document.getElementById('editSkills').value = data.SKILLS || '';
    document.getElementById('editExperience').value = data.EXPERIENCE || '';
    document.getElementById('editProjects').value = data.PROJECTS || '';
    document.getElementById('editEducation').value = data.EDUCATION || '';
    document.getElementById('editLanguages').value = data.LANGUAGES || '';

    editorArea.classList.remove('hidden');
  } catch (err) {
    alert('Error: ' + err.message);
  } finally {
    generateBtn.disabled = false;
    loading.classList.add('hidden');
  }
});

document
  .getElementById('downloadPdfBtn')
  .addEventListener('click', async () => {
    const btn = document.getElementById('downloadPdfBtn');
    btn.innerText = 'Generating PDF...';
    btn.disabled = true;

    const sections = {
      NAME: document.getElementById('editName').value,
      CONTACT: document.getElementById('editContact').value,
      HEADLINE: document.getElementById('editHeadline').value,
      SUMMARY: document.getElementById('editSummary').value,
      SKILLS: document.getElementById('editSkills').value,
      EXPERIENCE: document.getElementById('editExperience').value,
      PROJECTS: document.getElementById('editProjects').value,
      EDUCATION: document.getElementById('editEducation').value,
      LANGUAGES: document.getElementById('editLanguages').value,
    };

    const jobTitle =
      document.getElementById('targetJobTitle').value.trim() || 'Job';
    const applicantName = sections.NAME.trim() || 'Applicant';
    const fileName = `Application for ${jobTitle} - ${applicantName}.pdf`;

    try {
      const res = await fetch('/.netlify/functions/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections }),
      });

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert('PDF Failed');
    } finally {
      btn.innerHTML = '<i class="fa-solid fa-download"></i> Download PDF';
      btn.disabled = false;
    }
  });
