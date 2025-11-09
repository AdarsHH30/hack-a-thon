// Example usage of the new get-score endpoint
// This endpoint combines resume upload and matching in one call

const getMatchingScore = async (resumeFile, jobId) => {
  const formData = new FormData();
  formData.append('resume_file', resumeFile);
  formData.append('job_id', jobId);

  try {
    const response = await fetch('/api/get-score', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.success) {
      return {
        score: result.score,
        verdict: result.verdict,
        matchedSkills: result.matched_skills,
        missingSkills: result.missing_skills,
        suggestions: result.suggestions,
        jobInfo: result.job_info,
        resumeInfo: result.resume_info
      };
    } else {
      throw new Error('Score calculation failed');
    }
  } catch (error) {
    throw error;
  }
};

// Usage example:
// const resumeFile = event.target.files[0]; // From file input
// const jobId = 'some-job-id';
// const result = await getMatchingScore(resumeFile, jobId);