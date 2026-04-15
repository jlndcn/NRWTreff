import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';

const StickyFilterBar = ({ cities = [], regions = [], categories = [], basePath = '/' }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [city, setCity] = useState(searchParams.get('city') || 'all');
  const [region, setRegion] = useState(searchParams.get('region') || 'all');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [ageMin, setAgeMin] = useState(searchParams.get('age_min') || '');
  const [ageMax, setAgeMax] = useState(searchParams.get('age_max') || '');
  const [sheetOpen, setSheetOpen] = useState(false);

  const applyFilters = () => {
    const params = {};
    if (search) params.search = search;
    if (city && city !== 'all') params.city = city;
    if (region && region !== 'all') params.region = region;
    if (category && category !== 'all') params.category = category;
    if (ageMin) params.age_min = ageMin;
    if (ageMax) params.age_max = ageMax;
    setSearchParams(params);
    setSheetOpen(false);
  };

  const resetFilters = () => {
    setSearch('');
    setCity('all');
    setRegion('all');
    setCategory('all');
    setAgeMin('');
    setAgeMax('');
    setSearchParams({});
  };

  const hasFilters = search || (city && city !== 'all') || (region && region !== 'all') || (category && category !== 'all') || ageMin || ageMax;

  return (
    <div className="sticky top-14 z-30 border-b border-white/10" style={{ background: 'rgba(17,17,17,0.95)', backdropFilter: 'blur(8px)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5">
        {/* Desktop layout */}
        <div className="hidden md:flex items-center gap-2">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <Input
              data-testid="filter-bar-search-input"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && applyFilters()}
              placeholder="Name, Stadt..."
              className="pl-9 h-9 text-sm border-white/15 bg-white/5 text-white placeholder:text-white/30 focus:border-white/30"
            />
          </div>

          <Select value={city} onValueChange={setCity}>
            <SelectTrigger data-testid="filter-bar-city-select" className="w-36 h-9 text-sm border-white/15 bg-white/5 text-white">
              <SelectValue placeholder="Stadt" />
            </SelectTrigger>
            <SelectContent className="border-white/10" style={{ background: '#1a1a1a' }}>
              <SelectItem value="all" className="text-white/70">Alle Städte</SelectItem>
              {cities.map(c => <SelectItem key={c.slug} value={c.slug} className="text-white/80">{c.name}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="w-36 h-9 text-sm border-white/15 bg-white/5 text-white">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent className="border-white/10" style={{ background: '#1a1a1a' }}>
              <SelectItem value="all" className="text-white/70">Alle Regionen</SelectItem>
              {regions.map(r => <SelectItem key={r.slug} value={r.slug} className="text-white/80">{r.name}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger data-testid="filter-bar-category-select" className="w-36 h-9 text-sm border-white/15 bg-white/5 text-white">
              <SelectValue placeholder="Kategorie" />
            </SelectTrigger>
            <SelectContent className="border-white/10" style={{ background: '#1a1a1a' }}>
              <SelectItem value="all" className="text-white/70">Alle Kategorien</SelectItem>
              {categories.map(c => <SelectItem key={c.slug} value={c.slug} className="text-white/80">{c.name}</SelectItem>)}
            </SelectContent>
          </Select>

          <Button
            data-testid="filter-bar-apply-button"
            onClick={applyFilters}
            size="sm"
            className="h-9 px-4 font-medium"
            style={{ background: '#cc0000', color: '#fff' }}
          >
            Suchen
          </Button>

          {hasFilters && (
            <Button
              data-testid="filter-bar-reset-button"
              onClick={resetFilters}
              size="sm"
              variant="ghost"
              className="h-9 text-white/50 hover:text-white"
            >
              <X size={14} />
            </Button>
          )}
        </div>

        {/* Mobile layout */}
        <div className="flex md:hidden items-center gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <Input
              data-testid="filter-bar-search-input"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && applyFilters()}
              placeholder="Suchen..."
              className="pl-9 h-9 text-sm border-white/15 bg-white/5 text-white placeholder:text-white/30"
            />
          </div>

          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button
                data-testid="filter-bar-more-filters-button"
                size="sm"
                variant="outline"
                className="h-9 border-white/15 bg-white/5 text-white relative"
              >
                <SlidersHorizontal size={14} />
                {hasFilters && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{ background: '#cc0000' }} />}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="border-white/10 rounded-t-2xl" style={{ background: '#111', maxHeight: '80vh', overflowY: 'auto' }}>
              <SheetHeader className="mb-4">
                <SheetTitle className="text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>Filter</SheetTitle>
              </SheetHeader>
              <div className="space-y-4">
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger className="border-white/15 bg-white/5 text-white">
                    <SelectValue placeholder="Stadt wählen" />
                  </SelectTrigger>
                  <SelectContent className="border-white/10" style={{ background: '#1a1a1a' }}>
                    <SelectItem value="all" className="text-white/70">Alle Städte</SelectItem>
                    {cities.map(c => <SelectItem key={c.slug} value={c.slug} className="text-white/80">{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>

                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger className="border-white/15 bg-white/5 text-white">
                    <SelectValue placeholder="Region wählen" />
                  </SelectTrigger>
                  <SelectContent className="border-white/10" style={{ background: '#1a1a1a' }}>
                    <SelectItem value="all" className="text-white/70">Alle Regionen</SelectItem>
                    {regions.map(r => <SelectItem key={r.slug} value={r.slug} className="text-white/80">{r.name}</SelectItem>)}
                  </SelectContent>
                </Select>

                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="border-white/15 bg-white/5 text-white">
                    <SelectValue placeholder="Kategorie wählen" />
                  </SelectTrigger>
                  <SelectContent className="border-white/10" style={{ background: '#1a1a1a' }}>
                    <SelectItem value="all" className="text-white/70">Alle Kategorien</SelectItem>
                    {categories.map(c => <SelectItem key={c.slug} value={c.slug} className="text-white/80">{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Input value={ageMin} onChange={e => setAgeMin(e.target.value)} placeholder="Alter von" type="number" className="border-white/15 bg-white/5 text-white" />
                  <Input value={ageMax} onChange={e => setAgeMax(e.target.value)} placeholder="bis" type="number" className="border-white/15 bg-white/5 text-white" />
                </div>

                <div className="flex gap-2">
                  <Button onClick={applyFilters} className="flex-1" style={{ background: '#cc0000', color: '#fff' }}>Filter anwenden</Button>
                  {hasFilters && <Button onClick={resetFilters} variant="outline" className="border-white/15 text-white/70"><X size={14} /></Button>}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Button onClick={applyFilters} size="sm" className="h-9 px-3" style={{ background: '#cc0000', color: '#fff' }}>
            <Search size={14} />
          </Button>
        </div>

        {/* Active filter chips mobile */}
        {hasFilters && (
          <div className="flex gap-2 mt-2 overflow-x-auto filter-scroll pb-1">
            {search && <span className="text-xs px-2 py-0.5 rounded-full border whitespace-nowrap" style={{ borderColor: '#cc000066', color: '#ff4466', background: '#cc000015' }}>Suche: {search}</span>}
            {city && city !== 'all' && <span className="text-xs px-2 py-0.5 rounded-full border whitespace-nowrap" style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#e8e8e8', background: 'rgba(255,255,255,0.05)' }}>{cities.find(c => c.slug === city)?.name || city}</span>}
            {category && category !== 'all' && <span className="text-xs px-2 py-0.5 rounded-full border whitespace-nowrap" style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#e8e8e8', background: 'rgba(255,255,255,0.05)' }}>{categories.find(c => c.slug === category)?.name || category}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default StickyFilterBar;
