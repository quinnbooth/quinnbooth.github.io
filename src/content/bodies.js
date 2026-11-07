/**
 * Everything in the solar system, in order from the sun outward. The planets
 * borrow their looks from the real ones, Mercury through Neptune, so keep them
 * in that order if you move things around.
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
 *   tidbits   optional readouts that pop off the planet while you're landed
 *   sections  panel content, rendered by ui/sections.js
 *
 * Section types: lead, text, photo, figures, facts, bullets, roles, projects,
 * papers, video, tracks, gallery, links, contact. Strings may contain inline HTML.
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
    subtitle: 'Engineer in San Francisco. Guitarist everywhere else.',
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
          ['Based in', 'San Francisco'],
          ['Studied', 'EE + CS, Columbia'],
          ['Speaks', 'English, Spanish'],
          ['Off the clock', 'Guitar, building stuff'],
        ],
      },
      { type: 'links', items: 'standard' },
    ],
  },

  // ---------------------------------------------------------------------------
  {
    id: 'early',
    label: 'Early days',
    kicker: 'Early days',
    title: 'Before all this',
    subtitle: 'The jobs that came first',
    teaser: 'Wiring up escape rooms in high school, and a summer writing about science.',
    // Mercury: small, gray, closest to the sun. Fitting for the early stuff.
    look: {
      surface: 'rocky',
      size: 0.85,
      colors: ['#9b958d', '#4c4843', '#cfc8bd'],
      atmosphere: '#d9d2c6',
      tilt: 0.03,
      spin: 0.06,
    },
    orbit: { radius: 9, period: 50, phase: 0.9 },
    sections: [
      {
        type: 'roles',
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
    // Venus: thick, pale, slow-turning clouds.
    look: {
      surface: 'gas',
      size: 1.45,
      colors: ['#e6c98f', '#b0864c', '#f7ecd2'],
      atmosphere: '#ffe0a3',
      bands: 5,
      tilt: 0.05,
      spin: 0.04,
    },
    orbit: { radius: 12.5, period: 70, phase: 0.6 },
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
    // Earth, moon included.
    look: {
      surface: 'ocean',
      size: 1.55,
      colors: ['#1d5f8a', '#5f7d48', '#c8b07a'],
      atmosphere: '#7fc3ff',
      tilt: 0.41,
      spin: 0.16,
      moons: [{ size: 0.34, distance: 2.3, speed: 0.35, incline: 0.09 }],
    },
    orbit: { radius: 17, period: 105, phase: 2.7 },
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
    title: 'Robots, mostly',
    subtitle: 'Columbia University · 2022 – 2024 · Four papers',
    teaser: 'Robots that grow by eating other robots, a swarm that moves by vibrating, and the four papers about them.',
    // Mars.
    look: {
      surface: 'rocky',
      size: 1.15,
      colors: ['#b5492b', '#4d1b12', '#e09468'],
      atmosphere: '#ff8f6b',
      tilt: 0.44,
    },
    orbit: { radius: 22, period: 140, phase: 4.4 },
    // Little readouts that pop off the planet while you're landed. Keep each
    // one short: a label and a value, about 40 characters together, tops.
    tidbits: [
      { label: 'Papers', value: '4, one in Science Advances' },
      { label: 'My role', value: 'Hardware lead' },
      { label: 'Robot diet', value: 'Other robots' },
      { label: 'Seen on', value: 'Bloomberg Originals' },
      { label: 'Lab', value: 'Creative Machines, Columbia' },
    ],
    sections: [
      {
        type: 'lead',
        text: 'Two years in Hod Lipson’s Creative Machines Lab, building robots that don’t stay the shape you built them: truss robots that grow by taking parts from other robots, and a swarm that gets around by vibrating. Four papers came out of it, and the robots ended up on Bloomberg.',
      },
      {
        type: 'figures',
        items: [
          {
            src: img('research/truss-sphere.jpg'),
            caption: 'Truss Links, assembled into a 3D frame. Each bar is one robot.',
            alt: 'White bar-shaped robot modules joined at their ends into a rounded polyhedron, lit red and blue',
          },
          {
            src: img('research/truss-shape.jpg'),
            caption: 'Truss Links in a looser shape.',
            alt: 'White bar-shaped robot modules joined into an open frame, lit red and blue',
          },
          {
            src: img('research/particle-robot.jpg'),
            caption: 'The particle robot: vibrating cells in a loose chain.',
            alt: 'Five clear cylindrical robot cells with circuit boards inside, wrapped in a black chain-link band',
          },
        ],
      },
      {
        type: 'papers',
        heading: 'Papers',
        items: [
          {
            title: 'Robot metabolism: Toward machines that can grow by consuming other machines',
            venue: 'Science Advances',
            year: 2025,
            authors: 'Wyder, Bakhda, Zhao, <b>Booth</b>, … Lipson',
            position: '4th of 20 authors',
            blurb: 'Robots built from one simple, bar-shaped module that can grow, heal, and improve by absorbing modules from their surroundings, including other robots.',
            href: 'https://www.science.org/doi/10.1126/sciadv.adu6897',
            featured: true,
          },
          {
            title: 'Clay for the Creative Mind: Hands-On Robot Shaping Using Truss Links',
            venue: 'ACM Creativity & Cognition',
            year: 2026,
            authors: 'Wyder, Goldfeder, <b>Booth</b>, … ',
            position: '3rd of 8 authors',
            blurb: 'The same robot modules as a creative medium: building blocks that people without a robotics background can shape by hand.',
            href: 'https://dl.acm.org/doi/10.1145/3803784.3816836',
          },
          {
            title: 'Robot Links: Towards Self-Assembling Truss Robots',
            venue: 'IEEE ReMAR',
            year: 2024,
            authors: 'Wyder, Bakhda, Zhao, <b>Booth</b>, … Lipson',
            position: '4th of 18 authors',
            blurb: 'Introduces the Truss Link: a robot bar with magnetic ends that can find other links and assemble into larger structures.',
            href: 'https://ieeexplore.ieee.org/document/10619984',
          },
          {
            title: 'Vibrating Particle Robot',
            venue: 'IEEE ReMAR',
            year: 2024,
            authors: 'Batra, Wyder, Jhunjhunwala, <b>Booth</b>, … Lipson',
            position: '4th of 7 authors',
            blurb: 'A soft robot made of simple vibrating cells. None of them can steer, but together they move where a frequency gradient points them.',
            href: 'https://ieeexplore.ieee.org/document/10619983',
          },
        ],
      },
      {
        type: 'video',
        heading: 'On Bloomberg',
        youtube: 'sK5_pQV_QEA',
        title: 'What Happens When Robots Don’t Need Us Anymore?',
        caption: 'Bloomberg Originals, <i>Posthuman with Emily Chang</i>. Our robots make an appearance.',
      },
      {
        type: 'roles',
        heading: 'Where I worked',
        items: [
          {
            title: 'Hardware Lead, Robot Metabolism',
            org: 'Creative Machines Lab',
            when: 'May 2022 – May 2024',
            body: 'Led the hardware for the truss robots, and worked on the computer vision and cloud control that ran them. Used them to simulate evolution with robotic building blocks, and trained the grad students who joined after me.',
          },
          {
            title: 'Research Assistant, Particle Robots',
            org: 'Creative Machines Lab',
            when: 'Sep 2022 – May 2024',
            body: 'Soft robotics for a loosely coupled swarm, steered with frequency gradients. Built the cloud control setup for the robot fleet and prototyped PCBs.',
          },
          {
            title: 'IoT Research Assistant',
            org: 'Internet Real-Time Lab',
            when: 'Sep 2023 – Aug 2024',
            body: 'Firmware for low-power LoRa radios, and a batteryless device that runs on energy from motion around it.',
          },
          {
            title: 'ML Research Assistant',
            org: 'Department of Statistics',
            when: 'Jul – Oct 2023',
            body: 'Machine learning for data compression, through rate-distortion-perception theory, with Dr. Marcel Nutz.',
          },
        ],
      },
      { type: 'text', html: '<p class="sec__aside">Robots on the red planet felt right.</p>' },
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
    // Jupiter, and its four big moons.
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
    id: 'music',
    label: 'Music',
    kicker: 'Music',
    title: 'Mostly guitar',
    subtitle: 'Fifteen-ish years of it, plus one homemade guitar body',
    teaser: 'Recordings of me playing, and how I built a guitar body from scratch. Rings react to the audio.',
    // Saturn. The rings ripple when you play something.
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
    orbit: { radius: 38, period: 270, phase: 5.5 },
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
    id: 'education',
    label: 'Education',
    kicker: 'Education',
    title: 'Columbia University',
    subtitle: 'Fu Foundation School of Engineering and Applied Science',
    teaser: 'Two majors, one Morningside Heights apartment, a lot of breadboards.',
    // Uranus, knocked on its side. Also happens to be about Columbia blue.
    look: {
      surface: 'ice',
      size: 1.75,
      colors: ['#bfe3ee', '#76aec4', '#f0fbff'],
      atmosphere: '#a6ecf5',
      tilt: 1.65,
    },
    orbit: { radius: 46.5, period: 330, phase: 3.3 },
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
    id: 'contact',
    label: 'Contact',
    kicker: 'Contact',
    title: 'Send a signal',
    subtitle: 'The blinking light out past everything else.',
    teaser: 'Hiring, building something, or just want to talk guitars? This is where you reach me.',
    // Neptune, with a light on.
    look: {
      surface: 'ice',
      size: 1.6,
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
