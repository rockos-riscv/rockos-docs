import React from 'react';
import { translate } from '@docusaurus/Translate';
import { ProjectIcon } from './ProjectIcon';
import styles from './ProjectCard.module.css';

// Short type label shown in the corner badge, keyed by the `icon` field.
const ICON_LABELS = {
  kernel: '内核',
  bootloader: '启动',
  firmware: '固件',
  plugin: '插件',
  media: '影音',
};

export const ProjectCard = ({ title, repo, description, link, icon }) => (
  <a
    className={styles.card}
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    data-icon={icon}
  >
    <div className={styles.header}>
      <span className={styles.icon} aria-hidden="true">
        <ProjectIcon type={icon} />
      </span>
      <div className={styles.titleWrap}>
        <h3 className={styles.title}>{translate({ id: title, message: title })}</h3>
        <p className={styles.subtitle}>{repo}</p>
      </div>
      <span className={styles.badge}>{ICON_LABELS[icon] || ''}</span>
    </div>

    <p className={styles.description}>
      {translate({ id: description, message: description })}
    </p>

    <div className={styles.footer}>
      <span className={styles.viewLink}>
        {translate({ id: '在 GitHub 查看', message: '在 GitHub 查看' })}
        <span className={styles.arrow} aria-hidden="true">↗</span>
      </span>
    </div>
  </a>
);

export default ProjectCard;
