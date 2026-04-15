import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from './ui/breadcrumb';
import { Home } from 'lucide-react';

const Breadcrumbs = ({ items = [] }) => {
  return (
    <nav data-testid="breadcrumbs-nav" aria-label="Breadcrumb" className="py-3">
      <Breadcrumb>
        <BreadcrumbList className="text-xs text-white/50">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/" className="flex items-center gap-1 hover:text-white/80 transition-colors">
                <Home size={12} />
                Start
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {items.map((item, i) => (
            <React.Fragment key={item.href || `breadcrumb-${item.label}-${i}`}>
              <BreadcrumbSeparator className="text-white/30" />
              <BreadcrumbItem>
                {i === items.length - 1 ? (
                  <BreadcrumbPage className="text-white/70">{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={item.href} className="hover:text-white/80 transition-colors">{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </nav>
  );
};

export default Breadcrumbs;
