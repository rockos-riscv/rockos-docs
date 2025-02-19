import React, { useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import devices from "./devices.json"
import images from "./images.json"
import { Badge, Collapse, Card, Checkbox, Table, Space } from 'antd';
import { translate } from '@docusaurus/Translate';
import { DownloadOutlined } from '@ant-design/icons';

const ImageList = () => {
  const [selectReplaceBy, setSelectReplaceBy] = useState(false);
  const [selectModified, setSelectModified] = useState(false);

  const columns = [
    {
      title: translate({ id: "镜像版本", message: "镜像版本" }),
      dataIndex: "version",
      key: "version",
      width: "20rem",
      responsive: ["xs", "sm", "md", "lg"],
      render: (text) => <Badge color="green" count={text}></Badge>,
    },
    {
      title: translate({ id: "镜像大小", message: "镜像大小" }),
      dataIndex: "size",
      key: "size",
      width: "20rem",
      responsive: ["sm", "md", "lg", "xl"],
      render: (size) => (
        <p
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "0px",
          }}
        >
          {(Number(size) / 1024 / 1024 / 1024).toFixed(2)}GB
        </p>
      ),
    },
    {
      title: translate({ id: "发布日期", message: "发布日期" }),
      dataIndex: "date",
      key: "date",
      width: "20rem",
      responsive: ["md", "lg", "xl", "xxl"],
    },
    {
      title: translate({ id: "链接", message: "链接" }),
      key: "link",
      width: "20rem",
      render: (_, record) => (
        <Space size="middle">
          <a href={record.link}>
            <DownloadOutlined />
            {translate({ id: "下载", message: "下载" })}
          </a>
        </Space>
      ),
    },
  ];
  const collapseData = useMemo(() => {
    if (images && devices) {
      const transformedData = Object.entries(devices).map(([key, value], idx) => ({
        idx,
        key,
        desc: value.desc,
        replacedby: value.replacedby || null,
        modified: value.modified || false,
        children: images.filter((img) => img.device === key),
      }));

      const tableData = new Map();
      for (const item of transformedData) {
        const temp = item.children.map((item, idx) => ({
          key: idx,
          version: item.type,
          size: item.size,
          date: item.date,
          link: item.link
        }))
        tableData.set(item.key, temp)
      }

      const data = [];
      for (const item of transformedData) {
        if (!item.modified || selectModified) {
          if (!item.replacedby || selectReplaceBy) {
            const tableSource = tableData.get(item.key)
            data.push({
              key: String(item.idx),
              label: <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span>{translate({ id: item.desc, message: item.desc })}</span>
                <div style={{ gap: "0.2rem", width: "20%", display: "flex", justifyContent: "center", alignItems: "flex-start", alignContent: "flex-start" }}>
                  <Badge count={item.children.length} color='#0277c7'></Badge>
                  {(item.modified && selectModified) && <Badge color='gray' count={translate({ id: "定制", message: "定制" })}></Badge>}
                  {(item.replacedby && selectReplaceBy) && <Badge color='orange' count={translate({ id: "过时", message: "过时" })}></Badge>}
                </div>
              </div>,
              children: <div style={{ display: "flex", justifyContent: "center", alignItems: 'center' }}>
                <Table columns={columns} dataSource={tableSource} style={{ width: "100%" }} scroll={{ x: "100%" }} />
              </div>
            })
          }
        }
      }

      return data
    } else {
      return null
    }
  }, [devices, images, selectModified, selectReplaceBy])

  return (
    <Layout title="Hello" description="Hello React Page">
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
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
                fontSize: "1.5rem"
              }}>
                {translate({ id: "镜像列表", message: "镜像列表" })}
                <span style={{ color: "#d1d1d1", fontSize: "0.8rem", fontWeight: "50", display: "block" }}>{translate({ id: "RockOs 下的所有镜像", message: "RockOs 下的所有镜像" })}</span>
              </p>
            </div>
          }
            headStyle={{ borderBottom: "none" }}
            style={{ backgroundColor: "#2a6f97", marginTop: "1rem", width: "60%", border: "none" }}
          >
          </Card>
        </div>
        <div style={{ display: 'flex', alignContent: "flex-start", width: "50%", marginTop: "1rem" }}>
          <Checkbox checked={selectReplaceBy}
            onChange={() => {
              setSelectReplaceBy(!selectReplaceBy)
            }}>{translate({ id: "显示过时镜像", message: "显示过时镜像" })}</Checkbox>
          <Checkbox checked={selectModified}
            onChange={() => {
              setSelectModified(!selectModified)
            }}>{translate({ id: "显示定制镜像", message: "显示定制镜像" })}</Checkbox>
        </div>
        {collapseData && <Collapse items={collapseData} style={{ width: "50%", marginTop: "1rem", backgroundColor: "white", marginBottom: "1rem" }}></Collapse>}
      </div>
    </Layout>
  );
}

export default ImageList