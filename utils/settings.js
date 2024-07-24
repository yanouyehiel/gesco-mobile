export const settings = [
    {
        header: 'Préférences',
        items: [
            {
                id: 'language',
                icon: 'globe',
                label: 'Langue',
                type: 'select'
            },
            {
                id: 'darkMode',
                icon: 'moon',
                label: 'Mode Sombre',
                type: 'toggle'
            },
            {
                id: 'wifi',
                icon: 'wifi',
                label: 'Utiliser le Wi-Fi',
                type: 'toggle'
            },

        ]
    },
    {
        header: 'Aide',
        items: [
            {
                id: 'bug',
                icon: 'phone',
                label: 'Rapporter les bugs',
                type: 'link'
            },
            {
                id: 'contact',
                icon: 'mail',
                label: 'Contactez-nous',
                type: 'link'
            },
        ]
    },
    {
        header: 'Contenus',
        items: [
            {
                id: 'saved',
                icon: 'save',
                label: 'Contenus sauvegardés',
                type: 'link'
            },
            {
                id: 'download',
                icon: 'download',
                label: 'Téléchargements',
                type: 'link'
            },
        ]
    }
]