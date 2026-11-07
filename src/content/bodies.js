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
 * Section types: lead, text, photo, logo, figures, facts, bullets, roles, projects,
 * papers, video, launch, courses, tracks, gallery, links, contact. Strings may contain inline HTML.
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
        text: 'I studied electrical engineering and computer science at Columbia (EE major, CS minor) and never picked a favorite. My best work lives where the hardware and the software both have to cooperate, and I like it even more when they don’t and I get to find out why.',
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
  {
    id: 'astranis',
    label: 'Astranis',
    kicker: 'Work · Before',
    title: 'Astranis',
    subtitle: 'Flight Software Engineer II · Sep 2024 – Nov 2026',
    teaser: 'Flight software for geostationary satellites.',
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
    tidbits: [
      { label: 'Orbit', value: 'Geostationary, 35,786 km up' },
      { label: 'Secure boot', value: 'Every satellite in the fleet' },
      { label: 'Launch', value: 'Falcon 9, December 2024' },
    ],
    sections: [
      {
        type: 'lead',
        text: 'Astranis builds MicroGEOs: small, dedicated satellites that sit in geostationary orbit and bring internet to entire regions. I spent two years on flight software, mostly on what a satellite trusts: what it boots, what software it accepts, and how outside code runs on it safely.',
      },
      {
        type: 'bullets',
        heading: 'What I worked on',
        items: [
          '<b>Secure boot, fleet-wide.</b> Every satellite only runs software it can cryptographically verify, from power-on up.',
          '<b>A locked-down release pipeline,</b> so what we fly is exactly what we built and reviewed.',
          '<b>Hosting third-party payloads.</b> Largely rewrote the system that lets partners’ software run on our satellites, safely walled off from our own, and worked with partners to get them flying on it.',
          '<b>Telemetry and data reviews.</b> Owned our integration with the vendor platform we visualize telemetry on, as their main point of contact, and built tools that automate our data reviews.',
          '<b>Live anomaly triage.</b> On call to help work through problems on satellites in orbit, as they happen.',
          'Owned a major software release, start to finish.',
          'Ported our Monte Carlo test infrastructure to a new cloud provider.',
          'Ran the hiring process for an intern, then mentored them.',
        ],
      },
      {
        type: 'launch',
        heading: 'Launch day',
        title: 'Block 2: four satellites, one Falcon 9',
        when: 'December 29, 2024 · Cape Canaveral',
        note: 'Footage from The Launch Pad and NASASpaceflight. I worked on the satellites, not the videos.',
        clips: [
          {
            label: 'Liftoff',
            stamp: 'T+00:00',
            youtube: 'kQHlw4UJVAM',
            vertical: true,
          },
          {
            label: 'Satellite separation',
            stamp: 'T+00:33',
            youtube: 'a5lxyXToh-4',
            start: 5424, // 1:30:24, a beat before separation; then it keeps rolling
          },
        ],
      },
      {
        type: 'roles',
        heading: 'Roles',
        items: [
          { title: 'Flight Software Engineer II', when: 'Dec 2025 – Nov 2026' },
          { title: 'Flight Software Engineer', when: 'Sep 2024 – Nov 2025' },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  {
    id: 'anchor',
    label: 'Anchor Space',
    kicker: 'Work · Now',
    title: 'Anchor Space',
    subtitle: 'Co-founder · Y Combinator W27',
    teaser: 'My startup. We build software-defined optical ground stations: the ground end of laser links to satellites.',
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
    tidbits: [
      { label: 'Batch', value: 'Y Combinator W27' },
      { label: 'Downlink', value: 'Lasers, not radio' },
      { label: 'First light', value: 'First image sent over laser' },
    ],
    sections: [
      { type: 'logo', glow: '40, 140, 255', src: img('work/anchor-mark.webp'), alt: 'Anchor Space logo: an anchor with a satellite above it' },
      {
        type: 'lead',
        text: 'Satellites collect terabytes a day, and radio can’t get it all down. Lasers carry about 10x more. We build low-cost laser ground stations, doing in software what everyone else does with custom hardware.',
      },
      {
        type: 'facts',
        items: [
          ['Role', 'Co-founder'],
          ['Backed by', 'Y Combinator, Winter 2027'],
          ['Status', '<span class="status"><span class="status__pulse" aria-hidden="true"></span>Building</span>'],
        ],
      },
      { type: 'text', html: '<p class="sec__aside">Early days. More soon.</p>' },
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
    title: 'Things I’ve built',
    subtitle: 'From logic gates to language models.',
    teaser: 'A tank game built on an FPGA, a memory app in the works, an AI tutor for dataviz, and more.',
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
            name: 'FPGA Tank Battle',
            year: '2024',
            blurb: 'A two-player tank game built on a DE1-SoC FPGA, based on Battle City for the NES. Two controllers, VGA video, and sound through the WM8731 audio codec.',
            tags: ['C', 'SystemVerilog', 'FPGA', 'Embedded'],
            href: 'https://github.com/quinnbooth/Embedded-System-FPGA-Game',
            image: img('projects/tank-game.webp'),
            imageAlt: 'Gameplay: two small tanks moving through a maze of red brick walls',
            inset: img('projects/fpga-board.webp'),
            insetAlt: 'The DE1-SoC board running the game, its seven-segment displays lit red',
            insetLabel: 'The board',
            featured: 'Featured',
          },
          {
            name: 'Distill',
            status: 'Active',
            blurb: 'A journaling and memory app. It helps you recall what you’ve been up to, to keep your memory sharp and bring back the fun stuff you’d otherwise forget.',
            tags: ['Stealth mode'],
          },
          {
            name: 'LeetCode for DataViz',
            year: '2025',
            blurb: 'Practice data visualization problems while GPT-4o coaches you through them.',
            tags: ['Full stack', 'GPT-4o', 'JavaScript'],
            href: 'https://github.com/quinnbooth/Generative-AI-DataViz-Tool',
          },
          {
            name: 'Does Your Podcast Sound Popular?',
            year: '2025',
            blurb: 'Do a podcast’s audio features predict how it does on Spotify? I pulled them apart to find out.',
            tags: ['Python', 'Data analysis'],
            href: 'https://github.com/quinnbooth/Spotify-Podcast-Audio-Research',
          },
          {
            name: 'Predicting Customer Loyalty',
            year: '2025',
            blurb: 'A Kaggle entry. XGBoost and LightGBM, lots of feature engineering, and Bayesian hyperparameter tuning.',
            tags: ['ML', 'XGBoost', 'LightGBM'],
            href: 'https://github.com/quinnbooth/ML-Customer-Loyalty-Score',
          },
          {
            name: 'Serverless Social Network',
            year: '2024',
            blurb: 'A React social site on AWS: Amplify, AppSync GraphQL, DynamoDB, S3, and Cognito, with a GPT-2 integration.',
            tags: ['React', 'AWS', 'GraphQL'],
            href: 'https://github.com/quinnbooth/AWS-Social-Media-Site',
          },
          {
            name: 'Wave Function Collapse',
            year: '2023',
            blurb: 'Procedural image generation with an algorithm borrowed from quantum mechanics.',
            tags: ['JavaScript', 'Procedural'],
            href: 'https://github.com/quinnbooth/Wave-Function-Collapse',
          },
          {
            name: 'Fractal Playground',
            year: '2023',
            blurb: 'Four interactive fractals, plus one spirograph that’s fractal-adjacent.',
            tags: ['JavaScript', 'Generative'],
            href: 'https://github.com/quinnbooth/Fractal-Visualizations',
          },
          {
            name: 'This Solar System',
            year: '2026',
            blurb: 'Version one was how I learned JavaScript. Version two can actually land on a planet.',
            tags: ['Three.js', 'GLSL', 'Blender'],
            href: 'https://github.com/quinnbooth/quinnbooth.github.io',
          },
        ],
      },
      {
        type: 'links',
        items: [{ label: 'Everything else, on GitHub', href: 'https://github.com/quinnbooth?tab=repositories', icon: 'github' }],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  {
    id: 'music',
    label: 'Music',
    kicker: 'Music',
    title: 'Fingerstyle guitar',
    subtitle: 'Fifteen-ish years of it',
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
        text: 'I play acoustic fingerstyle, where one guitar covers the melody, the bass, and the rhythm at the same time. Here are two covers of players I’ve learned a lot from, and one piece of my own.',
      },
      {
        type: 'text',
        html: '<p>I also sing (a few years of choir and vocal lessons) and do some music production, mostly on my own recordings.</p>',
      },
      {
        type: 'tracks',
        heading: 'A few recordings',
        note: 'Hit play and watch the rings.',
        items: [
          { title: 'Grace', by: 'Calum Graham cover', src: audio('guitar-1.mp3') },
          { title: 'Archetype of Night', by: 'Original', src: audio('guitar-2.mp3') },
          { title: 'Heather’s Song', by: 'Andy McKee cover', src: audio('guitar-3.mp3') },
        ],
      },
      {
        type: 'gallery',
        heading: 'I also built a guitar body',
        note: 'Start to finish, with tools I made along the way.',
        items: [
          { src: img('guitar-build/step-1.jpg'), caption: 'Started by building a hot-wire foam cutter.' },
          { src: img('guitar-build/step-2.jpg'), caption: 'The same foam cutter, unfolded.' },
          { src: img('guitar-build/step-3.jpg'), caption: 'Cut a Telecaster template out of foam.' },
          { src: img('guitar-build/step-4.jpg'), caption: 'Used the template to make a mold.' },
          { src: img('guitar-build/step-5.jpg'), caption: 'Filled the mold with layers of beads, light to dark.' },
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
    subtitle: 'B.S. Electrical Engineering · Computer Science minor · 2020 – 2024',
    teaser: 'Electrical engineering, most of a CS degree on the side, a 3.94, and one class about Game of Thrones.',
    // Uranus, knocked on its side. Also happens to be about Columbia blue.
    look: {
      surface: 'ice',
      size: 1.75,
      colors: ['#bfe3ee', '#76aec4', '#f0fbff'],
      atmosphere: '#a6ecf5',
      tilt: 1.65,
    },
    orbit: { radius: 46.5, period: 330, phase: 3.3 },
    tidbits: [
      { label: 'GPA', value: '3.94' },
      { label: 'Credits', value: '153.5, not counting AP' },
      { label: 'Heaviest semester', value: '21 credits, twice' },
      { label: 'Concentration', value: 'Communications & Networking' },
      { label: 'Wildcard', value: 'A class on Game of Thrones' },
    ],
    sections: [
      {
        type: 'lead',
        text: 'I majored in electrical engineering and minored in computer science, though by the end I’d taken nearly everything the CS major asks for. I couldn’t choose between circuits and code, so I didn’t. Most semesters ran past 20 credits.',
      },
      {
        type: 'facts',
        items: [
          ['Degree', 'B.S., Electrical Engineering'],
          ['Concentration', 'Communications & Networking'],
          ['Minor', 'Computer Science'],
          ['Grades', '3.94 GPA · Dean’s List'],
          ['Years', 'Sep 2020 – May 2024'],
          ['Also', 'Columbia Space Initiative. Explains a lot about this website.'],
        ],
      },
      {
        type: 'courses',
        heading: 'What I took',
        note: 'The highlights, sorted by what they taught me.',
        items: [
          {
            group: 'Hardware',
            courses: [
              ['Embedded Systems', 'CSEE 4840'],
              ['Advanced Logic Design', 'CSEE 4823'],
              ['Electronic Circuits', 'ELEN 3331'],
              ['Solid-State Devices & Materials', 'ELEN 3106'],
              ['Electromagnetics', 'ELEN 3401'],
              ['Capstone Design', 'ELEN 3390'],
            ],
          },
          {
            group: 'Signals & networks',
            courses: [
              ['Signals & Systems', 'ELEN 3801'],
              ['Intro to Communication Systems', 'ELEN 3701'],
              ['Computer Networks', 'CSEE 4119'],
              ['Network Virtualization & Cloud Computing', 'ELEN 6770', 'Graduate level'],
              ['Solid-State, Microwave & Fiber Optics Lab', 'ELEN 3043'],
            ],
          },
          {
            group: 'Computer science',
            courses: [
              ['Advanced Programming', 'COMS 3157'],
              ['Data Structures in Java', 'COMS 3134'],
              ['Fundamentals of Computer Systems', 'CSEE 3827'],
              ['Discrete Mathematics', 'COMS 3203'],
              ['Computer Science Theory', 'COMS 3261'],
              ['Intro to Databases', 'COMS 4111'],
              ['User Interface Design', 'COMS 4170'],
            ],
          },
          {
            group: 'ML & data',
            courses: [
              ['Applied Machine Learning', 'COMS 4995'],
              ['Empirical Methods of Data Science', 'COMS 4995'],
              ['Design for Generative AI', 'COMS 6998', 'Graduate level'],
              ['Computational Linear Algebra', 'COMS 3251'],
              ['Probability for Engineers', 'IEOR 3658'],
            ],
          },
          {
            group: 'Wildcards',
            courses: [
              ['Masterpieces of Western Music', 'HUMA 1123'],
              ['Game of Thrones', 'MDES 1030', 'Yes, really'],
              ['Intro to Islamic Civilization', 'ASCM 2003'],
            ],
          },
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
    teaser: 'Hiring, building something, or just want to say hi? This is where you reach me.',
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
