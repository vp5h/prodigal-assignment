/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { Select, Slider, Row, Col, Table } from 'antd';

const { Option } = Select;

const Filtercomp = () => {
  const [selectedAgents, setSelectedAgents] = useState(['Alan Groves']);
  const [selectedDuration, setselectedDuration] = useState([20, 30]);
  const [results, setResults] = useState([]);

  const [agents, setAgents] = useState([]);
  const [duration, setDuration] = useState([]);

  useEffect(() => {
    fetch('https://damp-garden-93707.herokuapp.com/getlistofagents')
      .then(response => response.json())
      .then(result => setAgents(result.data.listofagents))
      .catch(error => console.log('error', error));

    fetch('https://damp-garden-93707.herokuapp.com/getdurationrange')
      .then(response => response.json())
      .then(result => setDuration(result.data))
      .catch(error => console.log('error', error));
  }, []);

  function handleSlderChange(value) {
    setselectedDuration(value);
  }

  function handleSelectChange(value) {
    setSelectedAgents(value);
  }

  useEffect(() => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      info: {
        filter_agent_list: selectedAgents,

        filter_time_range: selectedDuration,
      },
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(
      'https://damp-garden-93707.herokuapp.com/getfilteredcalls',
      requestOptions,
    )
      .then(response => response.json())
      .then(result => setResults(result.data))
      .catch(error => console.log('error', error));
  }, [selectedAgents, selectedDuration]);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'agent_id',
      key: 'agent_id',
    },
    {
      title: 'Call ID',
      dataIndex: 'call_id',
      key: 'call_id',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.call_id - b.call_id,
    },
    {
      title: 'Call Time',
      dataIndex: 'call_time',
      key: 'call_time',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.call_time - b.call_time,
    },
  ];
  return (
    <>
      <br />
      <br />
      {/* {JSON.stringify(selectedDuration)}
      {JSON.stringify(selectedAgents)} */}
      <Row justify="center" align="top">
        <Col span={24}>
          <Row justify="center" align="top">
            <Col span={4} justify="center">
              Duration
            </Col>
            <br />
            <Col span={20}>
              <Slider
                range
                defaultValue={[20, 30]}
                onChange={handleSlderChange}
                max={duration.maximum}
                min={duration.minimum}
              />
            </Col>
          </Row>
          <br />
          <Select
            mode="multiple"
            placeholder="Please select"
            defaultValue={['Alan Groves']}
            onChange={handleSelectChange}
            style={{ width: '100%' }}
          >
            {agents.map(agent => (
              <Option key={agent}>{agent}</Option>
            ))}
          </Select>
          <br /> <br />
          {/* {JSON.stringify(results)} */}
          <Table
            dataSource={results}
            rowKey={res => res.call_id}
            columns={columns}
          />
        </Col>
      </Row>
    </>
  );
};

export default Filtercomp;
