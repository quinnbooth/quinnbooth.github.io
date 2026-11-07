const base = import.meta.env.BASE_URL;

export const site = {
  name: 'Quinn Booth',
  email: 'qabooth@gmail.com',
  location: 'San Francisco',
  // Kept fresh by the deploy workflow; see README "Resume auto-update".
  resume: `${base}resume/quinn-booth-resume.pdf`,
  links: {
    github: 'https://github.com/quinnbooth',
    linkedin: 'https://www.linkedin.com/in/quinn-booth',
  },
  intro: {
    eyebrow: 'Flight log of',
    title: 'Quinn Booth',
    blurb:
      'Engineer in San Francisco. Every planet out there is a piece of my life. Hop in, I’ll drive.',
    cta: 'Take off',
  },
};
