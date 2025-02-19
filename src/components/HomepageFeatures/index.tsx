import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';
import { translate } from '@docusaurus/Translate';

type FeatureItem = {
  title: string;
  link: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: translate({ id: "项目列表", message: "项目列表" }),
    link: "/ProjectList",
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        {translate({ id: '探索 RockOS 相关项目，获取最新的开发进展和开源资源。轻松安装、配置和管理您的环境，快速搭建稳定的系统。', message: '探索 RockOS 相关项目，获取最新的开发进展和开源资源。轻松安装、配置和管理您的环境，快速搭建稳定的系统。' })}
      </>
    ),
  },
  {
    title: translate({ id: '镜像发布', message: '镜像发布' }),
    link: "/ImageList",
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        {translate({ id: '提供 RockOS 预构建镜像，助您快速部署。支持多种架构，轻松下载并安装，无需繁琐配置，让您的系统即刻启动。', message: '提供 RockOS 预构建镜像，助您快速部署。支持多种架构，轻松下载并安装，无需繁琐配置，让您的系统即刻启动。' })}
      </>
    ),
  },
  {
    title: translate({ id: '博客', message: '博客' }),
    link: "/blog",
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        {translate({ id: '阅读最新的技术文章、更新日志和开发者分享。了解 RockOS 生态的发展动态，获取深入的技术见解，助力高效开发。', message: '阅读最新的技术文章、更新日志和开发者分享。了解 RockOS 生态的发展动态，获取深入的技术见解，助力高效开发。' })}
      </>
    ),
  },
];

function Feature({ title, Svg, description, link }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>

      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Link to={link}>
          <Heading as="h3">{title}</Heading>
        </Link>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
