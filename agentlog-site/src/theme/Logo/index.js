import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useThemeConfig} from '@docusaurus/theme-common';
import {Plane} from 'lucide-react';

const styles = {
  logoWrapper: {
    width: '32px',
    height: '32px',
    background: 'linear-gradient(135deg, #00d1ff 0%, #0099cc 100%)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 15px rgba(0, 209, 255, 0.3)',
  },
  logoIcon: {
    width: '20px',
    height: '20px',
    color: '#0d1117',
    transform: 'rotate(-45deg)',
  },
};

export default function Logo(props) {
  const {
    siteConfig: {title},
  } = useDocusaurusContext();
  const {
    navbar: {title: navbarTitle, logo},
  } = useThemeConfig();
  const {imageClassName, titleClassName, ...propsRest} = props;
  const logoLink = useBaseUrl(logo?.href || '/');

  return (
    <Link
      to={logoLink}
      {...propsRest}
      {...(logo?.target && {target: logo.target})}
      style={{display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none'}}
    >
      <div style={styles.logoWrapper}>
        <Plane style={styles.logoIcon} />
      </div>
      {navbarTitle != null && <b className={titleClassName}>{navbarTitle}</b>}
    </Link>
  );
}
