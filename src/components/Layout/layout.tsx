/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { useEffect, FC } from "react";
import PropTypes from "prop-types";
import { useStaticQuery, graphql } from "gatsby";

import 'typeface-roboto';

import { makeStyles } from '@material-ui/core/styles';

import Toolbar from '@material-ui/core/Toolbar';

import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Zoom from '@material-ui/core/Zoom';

import { useDarkMode, Theme } from '@/components/Theme';
import Header from "@/components/Navbar/header";
import Footer from "@/components/Footer/footer";
import ScrollProgress from "@/components/Progress/Scroll";
import Head from "@/components/Layout/head";
import Seo from "@/components/Seo/seo";

import useConfig from '@/components/Config';

import "./layout.css";
import "./scroll.less";

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    top: '-3rem',
    right: theme.spacing(6),
    display: 'none',
    cursor: 'pointer',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
}));


interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  children: React.ReactElement | React.ReactElement[];
}

const ScrollTop = (props: Props)=> {
  const { children, window } = props;
  const classes = useStyles();
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = ((event.target as HTMLDivElement).ownerDocument || document).querySelector('#back-to-top-anchor');

    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <Zoom in={trigger}>
      <div onClick={handleClick} role="presentation" className={classes.root}>
        {children}
      </div>
    </Zoom>
  );
}

ScrollTop.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};


const Layout = (props: Props) => {
  const { config, getOtherImg } = useConfig();
  
  const data = useStaticQuery(graphql`
    query imageAndSiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  const [themeMode, toggle] = useDarkMode();
  const { children } = props;

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles!.parentElement!.removeChild(jssStyles);
    }
  }, []);

  useEffect(() => {
    const script: any = document.createElement('script');
    script.type = 'text/javascript';
    script.size = 150;
    script.alpha = 0.6;
    script.zIndex = -1;
    script.async = true;
    script.src = '/background/canvas-nest.js';
    document.head.appendChild(script);
  }, []);

  return (
    <div>
      <Seo
        title={config.meta.title}
        description={config.meta.description}
        lang={"zh"}
      />
      <Head />
      <Theme mode={themeMode}>

        <ScrollProgress />
        <Header
          siteTitle={data.site.siteMetadata.title}
          themeMode={{
            mode: themeMode,
            toggle,
          }}
        />
        <Toolbar id="back-to-top-anchor" />

        <main style={{ position: 'relative', top: '-3.5rem' }}>{children}</main>

        <Footer />
        <ScrollTop {...props}>
          <img alt="scroll" src={`${getOtherImg('scroll')}`} className={'scroll-top-jump'} />
        </ScrollTop>
      </Theme>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
