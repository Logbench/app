export const FAKE_LOGS = [
  {
    data: [
      {
        id: 1,
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        profile: {
          age: 29,
          bio: 'Avid traveler and photographer. Loves coding and coffee.',
          socialMedia: {
            twitter: '@alicej',
            instagram: '@alice.johnson',
            linkedIn: 'alice-johnson'
          },
          preferences: {
            newsletter: true,
            marketingEmails: false,
            darkMode: true
          }
        },
        address: {
          street: '123 Maple St',
          city: 'Springfield',
          state: 'IL',
          postalCode: '62701',
          geo: {
            lat: 39.7817,
            lng: -89.6501
          }
        },
        friends: [
          { id: 2, name: 'Bob Smith' },
          { id: 3, name: 'Charlie Doe' }
        ]
      },
      {
        id: 2,
        name: 'Bob Smith',
        email: 'bob.smith@example.com',
        profile: {
          age: 35,
          bio: 'Software engineer with a passion for open-source projects.',
          socialMedia: {
            twitter: '@bob_smith',
            github: 'bobsmith'
          },
          preferences: {
            newsletter: false,
            marketingEmails: true,
            darkMode: false
          }
        },
        address: {
          street: '456 Oak Rd',
          city: 'Columbus',
          state: 'OH',
          postalCode: '43215',
          geo: {
            lat: 39.9612,
            lng: -82.9988
          }
        },
        friends: [
          { id: 1, name: 'Alice Johnson' },
          { id: 4, name: 'Diana Prince' }
        ]
      },
      {
        id: 3,
        name: 'Charlie Doe',
        email: 'charlie.doe@example.com',
        profile: {
          age: 28,
          bio: 'Freelance writer and blogger. Exploring minimalism.',
          socialMedia: {
            medium: 'charliedoe',
            twitter: '@charlie_doe'
          },
          preferences: {
            newsletter: true,
            marketingEmails: false,
            darkMode: true
          }
        },
        address: {
          street: '789 Pine Ln',
          city: 'Austin',
          state: 'TX',
          postalCode: '73301',
          geo: {
            lat: 30.2672,
            lng: -97.7431
          }
        },
        friends: [
          { id: 1, name: 'Alice Johnson' },
          { id: 2, name: 'Bob Smith' }
        ]
      },
      {
        id: 4,
        name: 'Diana Prince',
        email: 'diana.prince@example.com',
        profile: {
          age: 32,
          bio: 'Graphic designer and superhero enthusiast.',
          socialMedia: {
            behance: 'dianaprince',
            instagram: '@diana.p'
          },
          preferences: {
            newsletter: true,
            marketingEmails: true,
            darkMode: false
          }
        },
        address: {
          street: '101 Wonder Ave',
          city: 'Metropolis',
          state: 'NY',
          postalCode: '10001',
          geo: {
            lat: 40.7128,
            lng: -74.006
          }
        },
        friends: [{ id: 2, name: 'Bob Smith' }]
      }
    ],
    metadata: {
      totalCount: 4,
      lastUpdated: '2024-11-19T12:00:00Z'
    }
  }
]
