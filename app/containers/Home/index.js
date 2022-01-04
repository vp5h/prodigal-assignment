/**
 *
 * Home
 *
 */

import React, { useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Button, Layout } from 'antd';

import './style.css';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';

import Filtercomp from './ProjComponents/FliterComp';
import Labelcomp from './ProjComponents/LabelComp';
import makeSelectHome from './selectors';
import reducer from './reducer';
import saga from './saga';

const { Header, Footer, Content } = Layout;
export function Home() {
  useInjectReducer({ key: 'home', reducer });
  useInjectSaga({ key: 'home', saga });
  const [parts, setParts] = useState(false);

  return (
    <>
      <Layout>
        <Header>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '10px',
            }}
          >
            <Button
              type="primary"
              onClick={() => {
                setParts(!parts);
              }}
            >
              Switch Parts
            </Button>
          </div>
        </Header>
        <Content style={{ minHeight: '90vh' }}>
          <div
            style={{
              justifyContent: 'center',
              maxWidth: '800px',
              margin: 'auto',
            }}
          >
            {parts ? <Filtercomp /> : <Labelcomp />}
          </div>
        </Content>
        <Footer>Designed by Pravesh</Footer>
      </Layout>
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  home: makeSelectHome(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(Home);
