const fs = require('fs');
let code = fs.readFileSync('src/pages/Kalender.tsx', 'utf8');

// Replace Hero Section to just a simple header
const startHero = code.indexOf('{/* Hero Section */}');
const endHero = code.indexOf('{/* Upcoming Events */}');
const newHero = `
        {/* Header Section */}
        <section className="mb-12">
            <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 space-y-6">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                        Semua Kalender Kegiatan
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                        Daftar lengkap seluruh agenda dan kegiatan komunitas warga RW 003.
                    </p>
                </div>
            </div>
        </section>
        `;
code = code.substring(0, startHero) + newHero + code.substring(endHero);

// Remove "Lihat Semua Kalender" link
const linkText = `<Link to="/kalender" className="text-secondary font-label-md text-label-md hover:text-tertiary flex items-center gap-1 mt-4 md:mt-0">
                        Lihat Semua Kalender <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>`;
code = code.replace(linkText, '');

// Change "Upcoming Events" to "Daftar Kegiatan"
code = code.replace('<h2 className="text-3xl font-bold text-gray-900 mb-2">Upcoming Events</h2>', '<h2 className="text-3xl font-bold text-gray-900 mb-2">Daftar Kegiatan</h2>');
code = code.replace('<p className="text-lg text-gray-600 leading-relaxed">Jadwal kegiatan terdekat di lingkungan kita.</p>', '');

// Remove `.slice(0, 3)`
code = code.replace('activities.slice(0, 3).map(', 'activities.map(');

// Remove Categories Section
const startCat = code.indexOf('{/* Activity Categories Grid */}');
const endCat = code.indexOf('{/* Event Detail Modal */}');
if (startCat !== -1 && endCat !== -1) {
  code = code.substring(0, startCat) + code.substring(endCat);
}

fs.writeFileSync('src/pages/Kalender.tsx', code);
console.log('Kalender patched');
