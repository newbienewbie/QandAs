import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import Header from './Header.jsx';
import ErrMsg from '../containers/ErrMsg';
import { Field } from 'redux-form';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Checkbox from 'material-ui/Checkbox';
import '../scss/answerBar.scss';
import { TOKEN_NAME } from '../../configs/config';

const boxStyle = {
  marginLeft: '12.5%',
  width: '75%',
  textAlign: 'left'
};

const textStyle = {
  width: '75%'
};

const renderRadio = ({ input, name, index, items, checkedIndex }) => {
  return (
    <RadioButtonGroup
      {...input}
      name={name}q
      style={boxStyle}w
      defaultSelected={checkedIndex}
    >
      {items.map((item, i) => {
        return (
          <RadioButton
            key={index + '_' + i}
            label={item}
            value={'' + i}
          />
        );
      })}
    </RadioButtonGroup>
  );
};

const renderCheckBox = ({ input, name, item, checked }) => {
  return (
    <Checkbox {...input}
      name={name}
      label={item}
      style={boxStyle}
      defaultChecked={checked}
    />
  );
};

const renderText = ({ input, name, type, hint, answer }) => {
  return (
    <TextField {...input}
      hintText={hint}
      name={name}
      style={textStyle}
      hintText={answer}
      floatingLabelText={answer}
    />
  );
};

function renderQuestions (questions) {
  return questions.map((question, index) => {
    switch (question.type) {
      case 1:
        return (
          <Paper className='question' key={'question' + index}>
            <h3 className='content'>{question.content}</h3>
            <Field
              name={'q' + index}
              index={index}
              items={question.items}
              component={renderRadio}
            />
          </Paper>
        );
      case 2:
        return (
          <Paper className='question' key={'question' + index}>
            <h3 className='content'>{question.content}</h3>
            {question.items.map((item, i) => {
              return (
                <Field
                  key={'item' + index + i}
                  name={'q' + index + '_' + i}
                  item={item}
                  component={renderCheckBox}
                />
              );
            })}
          </Paper>
        );
      case 3:
        return (
          <Paper className='question' key={'question' + index}>
            <h3 className='content'>{question.content}</h3>
            <Field
              type='text'
              name={'q' + index}
              hint=''
              component={renderText}
            />
          </Paper>
        );
      default:
        return null;
    }
  });
}

class AnswerBar extends Component {
  onSubmit = (data) => {
    const { paper, submitAnswer, changeErrMsg } = this.props;
    let answer = [];
    for (let key in data) {
      let index = -1;
      if (key.indexOf('_') !== -1) {
        index = Number(key.split('_')[0].slice(1));
        if (!answer[index]) {
          answer[index] = [];
        }
        answer[index][Number(key.split('_')[1])] = data[key];
      } else {
        index = Number(key.slice(1));
        answer[index] = data[key];
      }
    }
    let isFullfilled = answer.length > 0 ? true : false;
    for (let i = 0, len = paper.questions.length; i < len; ++i) {
      if (Array.isArray(answer[i]) && !answer[i].find((value) => {
        return value;
      }) || !answer[i]) {
        isFullfilled = false;
        break;
      }
    }
    if (!isFullfilled) {
      return changeErrMsg('请先完成问卷');
    }
    submitAnswer({
      answer: answer,
      _id: paper._id
    });
    browserHistory.replace('/answer/finished');
  }
  render () {
    const { paper, handleSubmit, submitting } = this.props;
    return (
      <div>
        <Header />
        <div className='answerWrapper'>
          <h3>{paper.title}</h3>
          <form onSubmit={handleSubmit(this.onSubmit)}>
            {renderQuestions(paper.questions)}
            <div className="fr">
              <RaisedButton type="submit" label="提交" disabled={submitting} />
            </div>
          </form>
        </div>
        <ErrMsg />
      </div>
    );
  }
}

AnswerBar.PropTypes = {
  paper: PropTypes.object,
  submitAnswer: PropTypes.func,
  changeErrMsg: PropTypes.func
};

export default AnswerBar;
