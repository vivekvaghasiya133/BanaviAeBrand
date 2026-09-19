import React from 'react';

export default function BusinessCategories() {
  const categories = [
    "Cafés", "Restaurants", "Salons", "Gyms", "Jewellery",
    "Fashion", "Real Estate", "Interior", "Automobile", "Education",
    "Travel", "Hotels", "Food Brands", "Local Businesses", "Personal Brands",
    "Events", "Furniture", "Beauty", "Architecture", "Services", "Manufacturing"
  ];

  return (
    <section className="py-24 bg-[#050507] border-y border-white/10">
      <div className="max-w-6xl mx-auto px-6 text-center">
        
        <div className="mb-16">
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight leading-tight">
            <span className="text-lime">30</span> PARTICIPANTS <br/>
            <span className="text-lime">30</span> DIFFERENT BUSINESS CHALLENGES <br/>
            <span className="text-lime">30</span> CONTENT CONCEPTS <br/>
            <span className="text-lime">30</span> REAL CONTENT PIECES
          </h2>
        </div>

        <div className="bg-[#101018] border border-white/10 rounded-3xl p-8 md:p-12">
          <h3 className="text-xl font-bold text-white/60 mb-8 uppercase tracking-widest">
            Examples of possible business categories
          </h3>
          
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {categories.map((cat, idx) => (
              <span 
                key={idx}
                className="px-4 py-2 bg-[#050507] border border-white/10 rounded-full text-white/80 font-medium text-sm md:text-base hover:border-[#3B82F6] hover:text-white transition-colors cursor-default"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
