/**
 * Everything in the solar system, in order from the sun outward.
 *
 * Want a new planet? Add an entry. The scene, the labels, the index, the
 * hover previews, and the panel are all generated from this list.
 *
 * Body fields
 *   id        URL slug (#/research)
 *   label     short name for the map labels and index
 *   kicker    small caps line above the title
 *   title     panel heading
 *   subtitle  one line under the heading
 *   teaser    the hover preview: what you'll find if you fly there
 *   look      how the planet is drawn (see world/Planet.js)
 *   orbit     radius (scene units) and period (seconds per lap)
 *   sections  panel content, rendered by ui/sections.js
 *
 * Section types: lead, text, photo, facts, bullets, roles, projects, tracks,
 * gallery, links, contact. Strings may contain inline HTML.
 */

const base = import.meta.env.BASE_URL;
const img = (path) => `${base}images/${path}`;
const audio = (path) => `${base}audio/${path}`;

export const bodies = [
  // ---------------------------------------------------------------------------
  {
    id: 'quinn',
    label: 'Quinn',
    kicker: 'The sun',
    title: 'Hi, I’m Quinn.',
    subtitle: 'Engineer in New York. Guitarist everywhere else.',
    teaser: 'Everything here orbits me. It’s my website, I’m allowed.',
    look: { size: 4 },
    sections: [
      { type: 'photo', src: img('quinn.jpg'), alt: 'Quinn, wearing headphones and a half smile', shape: 'round' },
      {
        type: 'lead',
        text: 'I studied electrical engineering and computer science at Columbia and never picked a favorite. My best work lives where the hardware and the software both have to cooperate, and I like it even more when they don’t and I get to find out why.',
      },
      {
        type: 'text',
        html: `<p>I taught myself JavaScript to build the first version of this site back in 2022. It had a spaceship that couldn’t catch planets. This one has been to flight school.</p>
<p>When I’m not at a keyboard I’m usually holding a guitar, writing something that’s harder to play than it needs to be.</p>`,
      },
      {
        type: 'facts',
        items: [
          ['Based in', 'New York City'],
          ['Studied', 'EE + CS, Columbia'],
          ['Speaks', 'English, Spanish'],
          ['Off the clock', 'Guitar, building stuff'],
        ],
      },
      {
        type: 'roles',
        heading: 'Before all this',
        items: [
          {
            title: 'Engineering Tech',
            org: 'The Escape Game',
            when: '2018 – 2019',
            where: 'Nashville',
            body: 'Part of the company’s only engineering team, in high school. Designed and built the electronics inside escape rooms, soldered circuit boards, and wrote a tool to track parts in the warehouse.',
          },
          {
            title: 'Science Writer',
            org: 'The Taiwan Times',
            when: 'Summer 2022',
            body: 'Wrote a dozen-plus articles on new scientific research. Turns out explaining things clearly is its own engineering problem.',
          },
        ],
      },
      { type: 'links', items: 'standard' },
    ],
  },

  // ---------------------------------------------------------------------------
  // TODO(quinn): Fill in your most recent job. Everything in [brackets] is a placeholder.
  {
    id: 'work-1',
    todo: true,
    label: '[Company]',
    kicker: 'Work · Now',
    title: '[Company]',
    subtitle: '[Role] · [Month Year] – present',
    teaser: '[One line: what you do here, in plain words.]',
    look: {
      surface: 'ocean',
      size: 1.55,
      colors: ['#1d5f8a', '#5f7d48', '#c8b07a'],
      atmosphere: '#7fc3ff',
      tilt: 0.41,
      spin: 0.16,
    },
    orbit: { radius: 11, period: 70, phase: 0.6 },
    sections: [
      { type: 'lead', text: '[Two or three sentences: what the company does and what you own there.]' },
      {
        type: 'bullets',
        heading: 'What I’ve worked on',
        items: ['[Thing you shipped and why it mattered]', '[Another one, with a number if you have one]', '[A third]'],
      },
      { type: 'facts', items: [['Stack', '[Languages, tools]'], ['Team', '[Size / org]']] },
    ],
  },

  // ---------------------------------------------------------------------------
  // TODO(quinn): Fill in the job before that.
  {
    id: 'work-2',
    todo: true,
    label: '[Company]',
    kicker: 'Work · Before',
    title: '[Company]',
    subtitle: '[Role] · [Month Year] – [Month Year]',
    teaser: '[One line: what you did here.]',
    look: {
      surface: 'rocky',
      size: 1.3,
      colors: ['#c47a45', '#6e3420', '#e8be8c'],
      atmosphere: '#ffb27a',
      tilt: 0.1,
    },
    orbit: { radius: 16, period: 105, phase: 2.7 },
    sections: [
      { type: 'lead', text: '[Two or three sentences.]' },
      { type: 'bullets', heading: 'Highlights', items: ['[Highlight]', '[Highlight]'] },
    ],
  },

  // ---------------------------------------------------------------------------
  {
    id: 'research',
    label: 'Research',
    kicker: 'Research',
    title: 'Creative Machines Lab',
    subtitle: 'Research Intern · Columbia University · Summer 2022',
    teaser: 'Robots that grow by absorbing parts from other robots. Seriously.',
    look: {
      surface: 'rocky',
      size: 1.15,
      colors: ['#b5492b', '#4d1b12', '#e09468'],
      atmosphere: '#ff8f6b',
      tilt: 0.44,
    },
    orbit: { radius: 21.5, period: 140, phase: 4.4 },
    sections: [
      {
        type: 'lead',
        text: 'I spent a summer on the Robot Metabolism project in Hod Lipson’s lab. The idea: machines that can grow, repair themselves, and get better by taking in parts from their surroundings, including other robots.',
      },
      {
        type: 'bullets',
        heading: 'What I did',
        items: [
          'Built modular robot components, the pieces the robots join and trade.',
          'Wrote computer vision code to track the robots during experiments.',
          'Designed and built the large arena the live experiments ran in.',
          'Ran, filmed, and documented the experiments.',
        ],
      },
      {
        type: 'text',
        html: '<p>Robots on the red planet felt right.</p>',
      },
    ],
  },

  // ---------------------------------------------------------------------------
  {
    id: 'projects',
    label: 'Projects',
    kicker: 'Projects',
    title: 'Things I built to see if I could',
    subtitle: 'Each moon is a project. Most of them worked.',
    teaser: 'An FPGA tank game, an AI tutor for charts, an evolution sim, a drum machine, and more.',
    look: {
      surface: 'gas',
      size: 3.1,
      colors: ['#e2b07a', '#8f4f2c', '#f6e1bd'],
      atmosphere: '#ffd3a1',
      bands: 16,
      tilt: 0.05,
      spin: 0.1,
      moons: [
        { size: 0.32, distance: 1.9, speed: 0.55 },
        { size: 0.24, distance: 2.35, speed: -0.42, incline: 0.3 },
        { size: 0.4, distance: 2.85, speed: 0.3, colors: ['#d8c9a8', '#6b5a44', '#efe2c4'] },
        { size: 0.2, distance: 3.3, speed: 0.24, incline: -0.25 },
      ],
    },
    orbit: { radius: 30, period: 210, phase: 1.2 },
    sections: [
      {
        type: 'projects',
        items: [
          {
            name: 'Tank battle on an FPGA',
            year: '2024',
            blurb: 'Two-player tank game running on a DE1-SoC (Cyclone V). Two controllers, VGA video, sound through the WM8731 codec. Love letter to Battle City on the NES.',
            tags: ['C', 'FPGA', 'Embedded'],
            href: 'https://github.com/quinnbooth/Embedded-System-FPGA-Game',
          },
          {
            name: 'Data viz trainer',
            year: '2025',
            blurb: 'Like LeetCode, but for charts. You practice data visualization problems and GPT-4o coaches you through them.',
            tags: ['Full stack', 'GPT-4o', 'JavaScript'],
            href: 'https://github.com/quinnbooth/Generative-AI-DataViz-Tool',
          },
          {
            name: 'Mito',
            year: '2025',
            blurb: 'A simulation of early life evolving. Small cells, big decisions.',
            tags: ['Godot', 'GDScript', 'Simulation'],
            href: 'https://github.com/quinnbooth/Mito',
          },
          {
            name: 'Beat Blocks',
            year: '2024',
            blurb: 'An analog drum kit driven by a step sequencer, with a theremin module playing bass.',
            tags: ['Analog circuits', 'Music'],
            href: 'https://github.com/quinnbooth/Beat-Blocks',
          },
          {
            name: 'Podcast audio research',
            year: '2025',
            blurb: 'Do a podcast’s audio features predict how it does on Spotify? I pulled them apart to find out.',
            tags: ['Python', 'Data analysis'],
            href: 'https://github.com/quinnbooth/Spotify-Podcast-Audio-Research',
          },
          {
            name: 'Customer loyalty model',
            year: '2025',
            blurb: 'Kaggle entry predicting customer loyalty. XGBoost and LightGBM, lots of feature engineering, Bayesian hyperparameter tuning.',
            tags: ['ML', 'XGBoost', 'LightGBM'],
            href: 'https://github.com/quinnbooth/ML-Customer-Loyalty-Score',
          },
          {
            name: 'Serverless social network',
            year: '2024',
            blurb: 'React social site on AWS: Amplify, AppSync GraphQL, DynamoDB, S3, Cognito, with a GPT-2 integration.',
            tags: ['React', 'AWS', 'GraphQL'],
            href: 'https://github.com/quinnbooth/AWS-Social-Media-Site',
          },
          {
            name: 'Wave function collapse',
            year: '2023',
            blurb: 'Procedural image generation with an algorithm borrowed from quantum mechanics.',
            tags: ['JavaScript', 'Procedural'],
            href: 'https://github.com/quinnbooth/Wave-Function-Collapse',
          },
          {
            name: 'Fractals',
            year: '2023',
            blurb: 'Four interactive fractals and one spirograph that’s fractal-adjacent.',
            tags: ['JavaScript', 'Generative'],
            href: 'https://github.com/quinnbooth/Fractal-Visualizations',
          },
          {
            name: 'Air quality lookup',
            year: '2023',
            blurb: 'Built the week wildfire smoke turned New York orange. Check your city’s air for the next 24 hours.',
            tags: ['React', 'APIs'],
            href: 'https://github.com/quinnbooth/React-Air-Quality-Lookup',
          },
          {
            name: 'AUXboard',
            year: '2018',
            blurb: 'A looping board for iOS, written in Swift back in high school. Everyone starts somewhere.',
            tags: ['Swift', 'iOS', 'Audio'],
            href: 'https://github.com/quinnbooth/AUXboard',
          },
          {
            name: 'This website',
            year: '2022, 2026',
            blurb: 'Version one was how I learned JavaScript. Version two can actually land on a planet.',
            tags: ['Three.js', 'GLSL', 'Blender'],
            href: 'https://github.com/quinnbooth/quinnbooth.github.io',
          },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  {
    id: 'education',
    label: 'Education',
    kicker: 'Education',
    title: 'Columbia University',
    subtitle: 'Fu Foundation School of Engineering and Applied Science',
    teaser: 'Two majors, one Morningside Heights apartment, a lot of breadboards.',
    look: {
      surface: 'ice',
      size: 1.45,
      // Columbia blue, more or less.
      colors: ['#b9d9eb', '#5f8fb0', '#f4fbff'],
      atmosphere: '#a8d8ff',
      tilt: 0.3,
    },
    orbit: { radius: 38, period: 270, phase: 3.3 },
    sections: [
      {
        type: 'facts',
        // TODO(quinn): confirm the degree name and graduation year.
        items: [
          ['Degree', 'B.S., Electrical Engineering & Computer Science'],
          ['Years', '2020 – 2024'],
          ['Honors', 'Dean’s List, National Merit Scholar'],
        ],
      },
      {
        type: 'lead',
        text: 'I couldn’t choose between circuits and code, so I took both. It made for long semesters and a much better sense of what’s actually happening under the hood.',
      },
      {
        type: 'bullets',
        heading: 'Classes that stuck',
        items: [
          'Embedded Systems (the FPGA tank game came out of this)',
          'Electronic Circuits',
          'Fundamentals of Computer Systems',
          'Advanced Programming',
          'Discrete Math',
          'Masterpieces of Western Music. It counted, and I’d take it again.',
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  {
    id: 'music',
    label: 'Music',
    kicker: 'Music',
    title: 'Mostly guitar',
    subtitle: 'Fifteen-ish years of it, plus one homemade guitar body',
    teaser: 'Recordings of me playing, and how I built a guitar body from scratch. Rings react to the audio.',
    look: {
      surface: 'gas',
      size: 2.4,
      colors: ['#e8d2a0', '#9c7f58', '#c4b4d6'],
      atmosphere: '#f3dcb0',
      bands: 11,
      tilt: 0.47,
      spin: 0.14,
      rings: { inner: 1.35, outer: 2.35, colors: ['#cdb68c', '#f1e4c8'] },
    },
    orbit: { radius: 46.5, period: 330, phase: 5.5 },
    sections: [
      { type: 'photo', src: img('guitar.jpg'), alt: 'An acoustic guitar leaning in a sunny dorm window', shape: 'wide' },
      {
        type: 'lead',
        text: 'Acoustic is home base. My favorite hobby is writing pieces that are a little too hard for me, then practicing them for months until they aren’t. Add some singing and production on top and every so often something comes out I’m proud of.',
      },
      {
        type: 'tracks',
        heading: 'A few recordings',
        note: 'Hit play and watch the rings.',
        // TODO(quinn): give these real names.
        items: [
          { title: 'Recording No. 1', src: audio('guitar-1.mp3') },
          { title: 'Recording No. 2', src: audio('guitar-2.mp3') },
          { title: 'Recording No. 3', src: audio('guitar-3.mp3') },
        ],
      },
      {
        type: 'gallery',
        heading: 'I also built a guitar body',
        note: 'From a pile of 2×4s to a Telecaster-shaped thing you can hold.',
        items: [
          { src: img('guitar-build/step-1.jpg'), caption: 'Started by building a hot-wire foam cutter.' },
          { src: img('guitar-build/step-2.jpg'), caption: 'Gave it a proper table.' },
          { src: img('guitar-build/step-3.jpg'), caption: 'Cut a Telecaster template out of foam.' },
          { src: img('guitar-build/step-4.jpg'), caption: 'Used the template to make a mold.' },
          { src: img('guitar-build/step-5.jpg'), caption: 'Packed it in layers, light to dark.' },
          { src: img('guitar-build/step-6.jpg'), caption: 'Out of the mold.' },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  {
    id: 'contact',
    label: 'Contact',
    kicker: 'Contact',
    title: 'Send a signal',
    subtitle: 'The blinking light out past everything else.',
    teaser: 'Hiring, building something, or just want to talk guitars? This is where you reach me.',
    look: {
      surface: 'ice',
      size: 1.05,
      colors: ['#3f7fc4', '#173a66', '#a9d6ff'],
      atmosphere: '#7cc0ff',
      tilt: 0.2,
      beacon: '#ffcf7a',
    },
    orbit: { radius: 54, period: 400, phase: 0.1 },
    sections: [
      {
        type: 'lead',
        text: 'Whether it’s a role, a project, or a question about something on this site, I’d like to hear it. I read everything and reply to real people.',
      },
      { type: 'contact' },
      { type: 'links', items: 'standard' },
    ],
  },
];
