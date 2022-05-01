import React from 'react';
import propTypes from 'prop-types';
import NavItem from './NavItem';
import NavCollapsed from './NavCollapsed';

const Navigator = ({ menu }) => {
  const isCollapsed = (item) => {
    return Object.prototype.hasOwnProperty.call(item, 'items');
  };

  return (
    <div id="layoutSidenav_nav">
      <nav
        className="sb-sidenav accordion sb-sidenav-dark"
        id="sidenavAccordion"
      >
        <div className="sb-sidenav-menu">
          <div className="nav">
            <div className="sb-sidenav-menu-heading">{menu.header}</div>
            <a className="nav-link" href={menu.url}>
              <div className="sb-nav-link-icon">
                <i className="fas fa-tachometer-alt"></i>
              </div>
              {menu.name}
            </a>

            {menu.navItems.map((item, key) => {
              if (isCollapsed(item)) {
                return (
                  <NavCollapsed
                    key={'nav_item' + key.toString()}
                    name={item.name}
                    iconClass={item.iconClass}
                    items={item.items}
                  />
                );
              }

              return (
                <NavItem
                  key={'nav_item' + key.toString()}
                  name={item.name}
                  iconClass={item.iconClass}
                  url={item.url}
                />
              );
            })}
          </div>
        </div>
        {/*<div className="sb-sidenav-footer">*/}
        {/*  <div className="small">Footer</div>*/}
        {/*  Footer*/}
        {/*</div>*/}
      </nav>
    </div>
  );
};

Navigator.propTypes = {
  menu: propTypes.shape({
    header: propTypes.string,
    url: propTypes.string,
    name: propTypes.string,
    navItems: propTypes.arrayOf(
      propTypes.oneOfType([
        propTypes.shape(NavItem.propTypes),
        propTypes.shape(NavCollapsed.propTypes),
      ]),
    ),
  }),
};

export default Navigator;