import React from 'react';
import Layout from '@theme/Layout';
import { translate } from '@docusaurus/Translate';
import projs from "./projects.json"
import { ProjectCard } from '@site/src/components/ProjectCard';
import styles from './index.module.css';

const ProjectList = () => {
  return (
    <Layout title="rockos 项目列表" description="rockos 项目列表">
      <div className={styles.container}>
        <div className={styles.intro}>
          <h1 className={styles.introTitle}>
            {translate({ id: "rockos 项目列表", message: "rockos 项目列表" })}
          </h1>
          <p className={styles.introSubtitle}>
            {translate({ id: "rockos 下的所有项目仓库", message: "rockos 下的所有项目仓库" })}
          </p>
          <p className={styles.introCount}>
            {translate({ id: "共 {count} 个项目", message: `共 ${projs.length} 个项目` }, { count: projs.length })}
          </p>
        </div>
        <div className={styles.cardListContainer}>
          {projs && projs.map((item) => (
            <ProjectCard key={item.repo} {...item} />
          ))}
        </div>
      </div>
    </Layout >
  );
}

export default ProjectList
