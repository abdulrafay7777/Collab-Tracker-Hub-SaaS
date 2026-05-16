/**
 * Generate a team member name based on index
 */
function generateTeamMemberName(index) {
  const names = [
    'John Developer', 'Sarah Designer', 'Mike QA', 'Alice Frontend',
    'Bob Backend', 'Carol DevOps', 'Dave Security', 'Emma Product'
  ];
  return names[index % names.length];
}

/**
 * Generate a team member role based on index
 */
function generateTeamMemberRole(index) {
  const roles = [
    'Senior Developer', 'UI/UX Designer', 'QA Engineer', 'Frontend Engineer',
    'Backend Engineer', 'DevOps Engineer', 'Security Engineer', 'Product Manager'
  ];
  return roles[index % roles.length];
}

module.exports = {
  generateTeamMemberName,
  generateTeamMemberRole
};
