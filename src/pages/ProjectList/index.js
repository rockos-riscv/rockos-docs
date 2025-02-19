import React from 'react';
import Layout from '@theme/Layout';
import projs from "./projects.json"
import { Card } from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import { translate } from '@docusaurus/Translate';
import Link from '@docusaurus/Link';

const ProjectList = () => {
  return (
    <Layout title="Hello" description="Hello React Page">
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: "column",
          height: "100%",
          width: "100%",
          fontSize: '20px',
        }}>
        <div style={{ width: "75%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Card title={
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              overflow: "hidden"
            }}>
              <p style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                flexGrow: 1,
                marginTop: "1rem",
                marginBottom: "0px",
                color: "white",
                fontSize: "1.5rem",
              }}>
                {translate({ id: "RockOs 项目列表", message: "RockOs 项目列表" })}
                <span style={{ color: "#d1d1d1", fontSize: "0.8rem", fontWeight: "50", display: "block" }}>{translate({ id: "RockOs 下的所有项目仓库", message: "RockOs 下的所有项目仓库" })}</span>
              </p>
            </div>
          }
            headStyle={{ borderBottom: "none" }}
            style={{ backgroundColor: "#2a6f97", marginTop: "1rem", width: "60%", border: "none" }}
          >
          </Card>
        </div>
        <div style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "1rem",
          width: "50%",
          marginTop: "1rem",
          marginBottom: "1rem"
        }}>
          {projs && projs.map((item, idx) => (
            <div key={idx} style={{
              width: "calc(50% - 1rem)",
              display: "flex"
            }}>
              <Link to={item.link} style={{ width: "100%" }}>
                <Card
                  hoverable
                  headStyle={{ display: "flex", alignItems: "center", marginBottom: "0px" }}
                  title={
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      overflow: "hidden"
                    }}>
                      <GithubOutlined style={{ fontSize: "2rem", flexShrink: 0 }} />
                      <p style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        flexGrow: 1,
                        marginTop: "1rem",
                        marginBottom: "0px"
                      }}>
                        {translate({ id: item.title, message: item.title })}
                        <span style={{ color: "grey", fontSize: "0.8rem", display: "block" }}>{item.repo}</span>
                      </p>
                    </div>
                  }
                >
                  <p>{translate({ id: item.description, message: item.description })}</p>
                </Card>
              </Link>
            </div>
          ))}
        </div>

      </div>
    </Layout >
  );
}

export default ProjectList