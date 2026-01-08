const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Dummy brawler data (simulating DynamoDB)
const BRAWLERS_DATA = [
    {
        Id: 101,
        Name: 'Shelly',
        Title: 'No time to explain!',
        Class: 'Damage Dealer',
        Rarity: 'Starting Brawler',
        Skin: 'Default',
        HealthByLevel: {
            '1': 3900,
            '5': 5460,
            '9': 7020,
            '11': 7800
        },
        Attack: {
            DamagePerShellLevel11: 600,
            Range: 7.67,
            Spread: 30,
            Projectiles: 5,
            ProjectileSpeed: 3100,
            Reload: 1.5
        },
        Super: {
            DamagePerShellLevel11: 640,
            Range: 7.67,
            Spread: 50,
            Projectiles: 9,
            ProjectileSpeed: 4130
        },
        StarPower: {
            Name: 'Band-Aid',
            HealLevel11: 2340,
            Description: 'Shelly heals for 10% of damage dealt'
        },
        Gadgets: [
            {
                Name: 'Fast Forward',
                Cooldown: 20,
                Range: 2.67,
                Description: 'Shelly quickly dashes forward'
            },
            {
                Name: 'Clay Pigeons',
                Cooldown: 18,
                Description: 'Shelly shoots faster for a short time'
            }
        ],
        MovementSpeed: {
            Base: 770,
            FastForward: 2400,
            Hypercharge: 924
        },
        Hypercharge: {
            Shield: 5,
            DamageBoost: 5,
            SpeedBoost: 20
        }
    },
    {
        Id: 102,
        Name: 'Colt',
        Title: 'Cowboy Gunslinger',
        Class: 'Damage Dealer',
        Rarity: 'Common',
        Skin: 'Default',
        HealthByLevel: {
            '1': 3000,
            '5': 4200,
            '9': 5400,
            '11': 6000
        },
        Attack: {
            DamagePerShellLevel11: 480,
            Range: 8.5,
            Spread: 15,
            Projectiles: 6,
            ProjectileSpeed: 3100,
            Reload: 1.2
        },
        Super: {
            DamagePerShellLevel11: 420,
            Range: 8.5,
            Spread: 30,
            Projectiles: 12,
            ProjectileSpeed: 3100
        },
        StarPower: {
            Name: 'Slick Boots',
            HealLevel11: 1200,
            Description: 'Colt gains increased movement speed'
        },
        Gadgets: [
            {
                Name: 'Speedloader',
                Cooldown: 15,
                Description: 'Colt reloads faster for a short time'
            },
            {
                Name: 'Mag Dump',
                Cooldown: 20,
                Description: 'Colt fires an extra round instantly'
            }
        ],
        MovementSpeed: {
            Base: 770,
            Hypercharge: 880
        },
        Hypercharge: {
            DamageBoost: 8,
            SpeedBoost: 15
        }
    },
    {
        Id: 103,
        Name: 'Jessie',
        Title: 'Demolition Expert',
        Class: 'Ranged Support',
        Rarity: 'Common',
        Skin: 'Default',
        HealthByLevel: {
            '1': 4200,
            '5': 5880,
            '9': 7560,
            '11': 8400
        },
        Attack: {
            DamagePerShellLevel11: 700,
            Range: 8.0,
            Spread: 20,
            Projectiles: 1,
            ProjectileSpeed: 3100,
            Reload: 1.8
        },
        Super: {
            DamagePerShellLevel11: 1500,
            Range: 12.0,
            Spread: 0,
            Projectiles: 1,
            ProjectileSpeed: 2500
        },
        StarPower: {
            Name: 'Shocky',
            HealLevel11: 1800,
            Description: 'Jessie\'s shots stun enemies'
        },
        Gadgets: [
            {
                Name: 'Spark Reload',
                Cooldown: 12,
                Description: 'Jessie reloads her weapon instantly'
            },
            {
                Name: 'Bounce Back',
                Cooldown: 18,
                Description: 'Jessie reflects the next shot'
            }
        ],
        MovementSpeed: {
            Base: 770
        }
    },
    {
        Id: 104,
        Name: 'Nita',
        Title: 'Bear Handler',
        Class: 'Fighter',
        Rarity: 'Rare',
        Skin: 'Default',
        HealthByLevel: {
            '1': 5600,
            '5': 7840,
            '9': 10080,
            '11': 11200
        },
        Attack: {
            DamagePerShellLevel11: 900,
            Range: 5.0,
            Spread: 60,
            Projectiles: 1,
            ProjectileSpeed: 2500,
            Reload: 2.0
        },
        Super: {
            DamagePerShellLevel11: 1200,
            Range: 10.0,
            Spread: 0,
            Projectiles: 1,
            ProjectileSpeed: 2000
        },
        StarPower: {
            Name: 'Bear With Me',
            HealLevel11: 2400,
            Description: 'Nita\'s bear protects her'
        },
        Gadgets: [
            {
                Name: 'Bear Paw',
                Cooldown: 15,
                Description: 'Nita charges forward with her bear'
            },
            {
                Name: 'Mama Bear',
                Cooldown: 20,
                Description: 'Nita\'s bear becomes stronger'
            }
        ],
        MovementSpeed: {
            Base: 770
        }
    },
    {
        Id: 105,
        Name: 'Brock',
        Title: 'Fireworks Expert',
        Class: 'Damage Dealer',
        Rarity: 'Rare',
        Skin: 'Default',
        HealthByLevel: {
            '1': 4200,
            '5': 5880,
            '9': 7560,
            '11': 8400
        },
        Attack: {
            DamagePerShellLevel11: 1200,
            Range: 9.0,
            Spread: 5,
            Projectiles: 1,
            ProjectileSpeed: 5000,
            Reload: 2.0
        },
        Super: {
            DamagePerShellLevel11: 1800,
            Range: 12.0,
            Spread: 0,
            Projectiles: 3,
            ProjectileSpeed: 4000
        },
        StarPower: {
            Name: 'Incendiary',
            HealLevel11: 1500,
            Description: 'Brock\'s explosions burn enemies'
        },
        Gadgets: [
            {
                Name: 'Explosive Liftoff',
                Cooldown: 18,
                Description: 'Brock launches himself backward'
            },
            {
                Name: 'Rocket Fuel',
                Cooldown: 15,
                Description: 'Brock\'s rockets move faster'
            }
        ],
        MovementSpeed: {
            Base: 770
        }
    }
];

// API Routes (simulating API Gateway endpoints)

// Get all brawlers
app.get('/api/brawlers', (req, res) => {
    res.json(BRAWLERS_DATA);
});

// Get brawler by ID
app.get('/api/brawlers/:id', (req, res) => {
    const brawler = BRAWLERS_DATA.find(b => b.Id === parseInt(req.params.id));
    if (brawler) {
        res.json(brawler);
    } else {
        res.status(404).json({ error: 'Brawler not found' });
    }
});

// Serve index.html for root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Fallback for client-side routes (e.g., /brawler/:id)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
