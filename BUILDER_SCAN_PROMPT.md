# Builder.io Site-Wide Code Health Scan Prompt

Use this prompt in Builder.io to scan ALL pages and components:

---

**Scan ALL pages and components for code issues, broken bindings, missing variables, unused code, and performance problems. Report and FIX when safe:**

- Broken data bindings / undefined state
- JavaScript expression errors  
- Unused components/styles/sections
- Missing `<alt>` on images
- Accessibility violations (focus order, roles, labels)
- Deprecated or unsupported APIs
- Performance bottlenecks and inefficient code
- Missing error handling
- Inconsistent styling patterns
- Unused CSS classes and styles
- Missing TypeScript types
- Console errors and warnings
- Memory leaks in React components
- Inefficient re-renders
- Missing loading states
- Broken navigation links
- Form validation issues
- Missing ARIA labels and roles
- Color contrast violations
- Focus management problems

**Important constraints:**
- Do NOT change visual design except when required to fix an issue
- Do NOT touch dark mode or hero section  
- Do NOT modify the established color theme
- Focus on functional and accessibility fixes only
- Preserve existing component structure where possible
- Maintain responsive design integrity

**Report format:**
For each issue found, provide:
1. Issue type and severity
2. Location (page/component)
3. Problem description
4. Recommended fix
5. Whether fix was applied or requires manual intervention

**Priority order:**
1. Broken functionality (highest)
2. Accessibility violations
3. Performance issues
4. Code quality problems
5. Unused code cleanup (lowest)

---

This prompt ensures comprehensive coverage while preserving your design and theme integrity.
