/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import axios from 'axios';

const { Option } = Select;
const Labelholder = ({
  labels,
  labellist,
  callid,
  calllist,
  setrefresh,
  refresh,

  changedIndexes,
}) => {
  const id = callid.call_id;

  const [singleselectlabels, setsingleSelectedLabels] = useState(labels);
  const [isValueChecked, setIsValueChecked] = useState(false);
  function handleLabelChange(value) {
    // console.log(value, id);
    // console.log(calllist[id], calllist)
    //  setCallList( [...calllist, calllist[id].label_id = value])
    setsingleSelectedLabels(value);
  }

  useEffect(() => {
    setsingleSelectedLabels(calllist[id].label_id);
  }, [changedIndexes]);

  useEffect(() => {
    addorremovecalcs();
  }, [singleselectlabels]);

  useEffect(() => {
    if (changedIndexes.includes(id)) {
      setIsValueChecked(true);
    }
    if (!changedIndexes.includes(id)) {
      setIsValueChecked(false);
    }
  }, [changedIndexes, id]);

  async function addorremovecalcs() {
    if (labels) {
      if (
        singleselectlabels.filter(x => !calllist[id].label_id.includes(x))
          .length === 0
      ) {
        // remove labels
        // console.log("remove")
        let removeops = [];
        calllist[id].label_id
          .filter(x => !singleselectlabels.includes(x))
          .map(itm => {
            removeops.push({ name: itm, op: 'remove' });
            return null;
          });
        // console.log(removeops, id)

        if (removeops.length > 0) {
          await axios({
            method: 'POST',
            url: 'https://damp-garden-93707.herokuapp.com/applyLabels',
            headers: {
              user_id: '24b456',
            },
            data: { operation: { callList: [id], label_ops: removeops } },
          })
            .then(res => {
              console.log(res.data);
              removeops = [];

              setrefresh(!refresh);
            })
            .catch(err => {
              console.log(err);
            });
        }
      }
    }

    if (
      calllist[id].label_id.filter(x => !singleselectlabels.includes(x))
        .length === 0
    ) {
      // add labels
      // console.log("add")
      let addops = [];
      singleselectlabels
        .filter(x => !calllist[id].label_id.includes(x))
        .map(itm => {
          addops.push({ name: itm, op: 'add' });
          return null;
        });
      // console.log(addops, id)

      if (addops.length > 0) {
        await axios({
          method: 'POST',
          url: 'https://damp-garden-93707.herokuapp.com/applyLabels',
          headers: {
            user_id: '24b456',
          },
          data: { operation: { callList: [id], label_ops: addops } },
        })
          .then(res => {
            console.log(res.data);
            addops = [];

            setrefresh(!refresh);
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  }

  return (
    <>
      <>
        {/* {JSON.stringify(singleselectlabels)}
       
        {singleselectlabels.filter((x) => !calllist[id].label_id.includes(x))}
        <br/>
        {calllist[id].label_id.filter((x) => !singleselectlabels.includes(x))} */}

        <Select
          mode="multiple"
          placeholder="Please select"
          value={calllist[id].label_id}
          onChange={value => handleLabelChange(value, id)}
          style={{ width: '100%' }}
          disabled={isValueChecked}
        >
          {labellist === null || labellist === undefined
            ? undefined
            : labellist.map(agent => <Option key={agent}>{agent}</Option>)}
        </Select>
      </>
    </>
  );
};

export default Labelholder;
