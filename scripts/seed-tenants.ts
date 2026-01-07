/**
 * scripts/seed-tenants.ts
 * CLI utility to bulk provision tenants via the API or direct D1 access.
 */

const SAMPLE_TENANTS = [
    {
        slug: "web4strategy",
        name: "Web4 Strategy",
        primaryDomain: "web4strategy.com",
        config: {
            meta: { siteTitle: "Web4 Strategy | Enterprise SaaS" },
            appearance: { brandColor: "#0f172a" },
            modules: {
                activeList: ["cms", "seo"],
                visibility: { cms: ["admin", "editor"], seo: ["admin"] }
            }
        }
    },
    {
        slug: "jurisquest",
        name: "JurisQuest",
        primaryDomain: "jurisquest.com",
        config: {
            meta: { siteTitle: "JurisQuest | Legal Excellence" },
            appearance: { brandColor: "#1e293b" },
            modules: {
                activeList: ["cms"],
                visibility: { cms: ["admin", "editor"] }
            }
        }
    }
];

// This script can be expanded to use fetch() to the local/remote API
// For now, it defines the standard payload for the Breeze Provisioning UI.
console.log('Ready to seed tenants:', JSON.stringify(SAMPLE_TENANTS, null, 2));
