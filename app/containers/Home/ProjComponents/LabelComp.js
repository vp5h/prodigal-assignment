/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Select, Row, Col, Table, Button, Modal } from 'antd';

import Labelholder from './Labelholder';
const { Option } = Select;
const Labelcomp = () => {
  const [calllist, setCallList] = useState([]);
  const [labellist, setLabelList] = useState();
  const [changeMul, setChangeMul] = useState(false);
  const [changedvalues, setchnagedValues] = useState([]);
  const [changedIndexes, setchnagedIndexes] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [refresh, setrefresh] = useState(true);
  const [removableLabel, setRemovableLabel] = useState([]);
  const [editedmodalLabels, setEditedmodalLabels] = useState(removableLabel);

  useEffect(() => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('user_id', '24b456');

    fetch('https://damp-garden-93707.herokuapp.com/getcalllist', {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    })
      .then(response => response.json())
      .then(result => setCallList(result.data.call_data))
      .catch(error => console.log('error', error));
  }, [refresh]);

  useEffect(() => {
    const myHeaders2 = new Headers();
    myHeaders2.append('Content-Type', 'application/json');
    myHeaders2.append('user_id', '24b456');

    fetch('https://damp-garden-93707.herokuapp.com/getlistoflabels', {
      method: 'GET',
      headers: myHeaders2,
      redirect: 'follow',
    })
      .then(response => response.json())
      .then(result => setLabelList(result.data.unique_label_list))
      .catch(error => console.log('error', error));
  }, []);

  useEffect(() => {
    if (changedvalues) {
      commoneleinselected();
    }
  }, [changedvalues, refresh]);

  useEffect(() => {
    setRemovableLabel(editedmodalLabels);
  }, [refresh]);

  useEffect(() => {
    addremoveMultipleCalcs();
  }, [editedmodalLabels]);
  const columns = [
    {
      title: 'Call ID',
      dataIndex: 'call_id',
      key: 'call_id',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.call_id - b.call_id,
    },
    {
      title: 'Label',
      dataIndex: 'label_id',
      key: 'label_id',
      render: (Labels, callId, record) => (
        <span>
          <Labelholder
            calllist={calllist}
            setCallList={setCallList}
            labels={Labels}
            callid={callId}
            refresh={refresh}
            setrefresh={setrefresh}
            changedvalues={changedvalues}
            changedIndexes={changedIndexes}
            record={record}
            key={Labels}
            labellist={labellist}
          />
        </span>
      ),
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows,
      );

      setchnagedValues(selectedRows);
      setchnagedIndexes(selectedRowKeys);
      // commoneleinselected();
      if (selectedRows.length === 0) {
        setChangeMul(false);
      } else {
        setChangeMul(true);
      }
    },
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    // setrefresh(!refresh);
  };

  function commoneleinselected() {
    const labelarr = [];
    changedvalues.map(values => {
      labelarr.push(values.label_id);
      return null;
    });
    if (labelarr.length > 0) {
      const commonarr = labelarr.reduce((p, c) => p.filter(e => c.includes(e)));
      // console.log(commonarr);
      setRemovableLabel(commonarr);
      if (isModalVisible === false) {
        setEditedmodalLabels(commonarr);
      }
    }
  }
  function handleModalLabelChange(value) {
    setEditedmodalLabels(value);

    // console.log(value);
  }

  async function addremoveMultipleCalcs() {
    if (
      removableLabel.filter(x => !editedmodalLabels.includes(x)).length === 0
    ) {
      // add multiple
      let addarr = [];
      editedmodalLabels
        .filter(x => !removableLabel.includes(x))
        .map(itm => {
          addarr.push({ name: itm, op: 'add' });
          return null;
        });
      // console.log(addarr);

      if (addarr.length > 0) {
        await axios({
          method: 'POST',
          url: 'https://damp-garden-93707.herokuapp.com/applyLabels',
          headers: {
            user_id: '24b456',
          },
          data: { operation: { callList: changedIndexes, label_ops: addarr } },
        })
          .then(res => {
            console.log(res.data);
            addarr = [];

            setrefresh(!refresh);
          })
          .catch(err => {
            console.log(err);
          });
      }
    }

    // remove arr

    if (
      editedmodalLabels.filter(x => !removableLabel.includes(x)).length === 0
    ) {
      let removearr = [];
      removableLabel
        .filter(x => !editedmodalLabels.includes(x))
        .map(itm => {
          removearr.push({ name: itm, op: 'remove' });
          return null;
        });
      // console.log(removearr);

      if (removearr.length > 0) {
        await axios({
          method: 'POST',
          url: 'https://damp-garden-93707.herokuapp.com/applyLabels',
          headers: {
            user_id: '24b456',
          },
          data: {
            operation: { callList: changedIndexes, label_ops: removearr },
          },
        })
          .then(res => {
            console.log(res.data);
            removearr = [];

            setrefresh(!refresh);
          })
          .catch(err => {
            console.log(err);
          });
      }
    } // add arr
  }

  return (
    <>
      <br />

      {changeMul ? (
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <br />

          <Button type="primary" onClick={showModal}>
            Edit Multiple
          </Button>

          <br />
          <br />
          <br />
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          Select Cols to See multiple Update Options
        </div>
      )}
      <br />

      <Row justify="center" align="top">
        <Col span={24}>
          <Table
            rowSelection={{
              type: 'checkbox',
              ...rowSelection,
            }}
            dataSource={[...calllist]}
            rowKey={results => results.call_id}
            columns={columns}
          />
        </Col>
      </Row>
      <Modal
        title="Multiple Add and Remove"
        visible={isModalVisible}
        onOk={handleOk}
      >
        <br />
        Selected elemenets are the common elemenets, You can add labels by
        Selecting more labels they will be applied to all selected calls
        <br />
        <Select
          mode="multiple"
          placeholder="Please select"
          value={editedmodalLabels}
          onChange={value => handleModalLabelChange(value)}
          style={{ width: '100%' }}
        >
          {labellist === null || labellist === undefined
            ? undefined
            : labellist.map(agent => <Option key={agent}>{agent}</Option>)}
        </Select>
      </Modal>
    </>
  );
};

export default Labelcomp;
