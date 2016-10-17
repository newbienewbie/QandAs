import React, { Component, PropTypes } from 'react';
import '../scss/editor.scss';
import { browserHistory } from 'react-router';
import Header from './Header.jsx';
import Calendar from './Calendar.jsx';
import Question from './Question.jsx';
import ErrMsg from '../containers/ErrMsg';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { TOKEN_NAME } from '../../configs/config';

class Editor extends Component {
  constructor (props) {
    super(props);
  }
  handleChangeTitle = (event) => {
    this.props.actions.changeQuestionTitle(event.target.value);
  }
  handleCreateQuestion = () => {
    this.props.actions.createQuestion({
      type: 1,
      content: '',
      items: []
    })
  }
  handleRemoveAllQuestions = () => {
    this.props.actions.removeQuestion(true);
  }
  handleSubmit = () => {
    const { user, title, questions, time, paper, saved, actions } = this.props;
    const { year, month, date } = time;
    const { account } = user;
    const { changeErrMsg } = actions;
    const data = {
      token: window.localStorage.getItem(TOKEN_NAME),
      title,
      questions,
      time: {
        year,
        month,
        date
      }
    };
    if (!title) {
      return changeErrMsg('保存失败, 问卷名不能为空');
    } else if (title.length > 30) {
      return changeErrMsg('保存失败, 问卷名过长');
    } else if (questions.length === 0) {
      return changeErrMsg('保存失败, 请添加问题和选项');
    }
    for (let i = 0, len = questions.length; i < len; ++i) {
      let question = questions[i];
      if (!question.content) {
        return changeErrMsg('保存失败, 问题题干不能为空');
      }
      if (question.type === 1 || question.type === 2) {
        if (question.items.length === 0) {
          return changeErrMsg('保存失败, 客观题不能没有选项');
        }
        if (question.items.indexOf('') > -1) {
          return changeErrMsg('保存失败, 问题选项不能为空');
        }
      }
    }
    if (paper) {
      Object.assign(data, { _id: paper._id });
    } else if (!saved) {
      actions.changePaperSaved(true);
    }
    actions.submitPaper(data);
  }
  renderDefaultPaper = () => {
    const { paper, actions } = this.props;
    const {
      title,
      questions,
      time
    } = paper;
    const {
      changeQuestionTitle,
      createQuestion,
      changeCalendar
    } = actions;
    if (title) {
      changeQuestionTitle(title);
    }
    if (questions) {
      questions.forEach((q, i) => {
        createQuestion(q);
      });
    }
    if (time) {
      changeCalendar(Object.assign({}, time, { visible: false }));
    }
  }
  componentDidMount () {
    if (this.props.paper) {
      this.renderDefaultPaper();
    }
  }
  render () {
    const {
      user,
      title,
      questions,
      calendar,
      time,
      actions,
      paper,
      saved,
      publishConfirmOpen
    } = this.props;
    const qs = questions.map((q, index) => {
      return (
        <Question
          key={'Question' + index}
          index={index}
          type={q.type}
          content={q.content}
          items={q.items}
          editQuestion={actions.editQuestion}
          removeQuestion={actions.removeQuestion}
        />
      );
    });
    return (
      <div>
        <Header />
        <div className='create'>
          <TextField
            style={{ display: 'block' }}
            floatingLabelText='问卷名称'
            value={title}
            onChange={this.handleChangeTitle}
          />
          <RaisedButton
            className='createBtn'
            label='添加新问题'
            onClick={this.handleCreateQuestion}
          />
          <RaisedButton
            className='createBtn'
            label='全部删除'
            onClick={this.handleRemoveAllQuestions}
          />
          <RaisedButton
            backgroundColor='#2196F3'
            labelColor='#ffffff'
            className='createBtn'
            label='保存'
            onTouchTap={this.handleSubmit}
          />
          {
            (paper &&
            paper.creator === user.account &&
            paper.state === 0 ||
            saved) &&
            <RaisedButton
              backgroundColor='#2196F3'
              labelColor='#ffffff'
              className='publishButton'
              label='发布'
              onTouchTap={() => {
                actions.changePublishConfirm(true);
              }}
            />
          }
          <Calendar
            calendar={calendar}
            time={time}
            setCalendar={actions.setCalendar}
            changeCalendar={actions.changeCalendar}
            changeCalendarVisible={actions.changeCalendarVisible}
            title='截止日期'
          />
          {qs}
          <Dialog
            title='问卷发布后不可修改或撤回, 确认发布?'
            actions={[
              <FlatButton
                label='确认'
                primary={true}
                onTouchTap={() => {
                  actions.publishPaper(paper._id, window.localStorage.getItem(TOKEN_NAME));
                  actions.changePublishConfirm(false);
                  browserHistory.push('/');
                }}
              />,
              <FlatButton
                label='取消'
                onTouchTap={() => {
                  actions.changePublishConfirm(false);
                }}
              />
            ]}
            modal={true}
            open={publishConfirmOpen}
          />
        </div>
        <ErrMsg />
      </div>
    );
  }
}

Editor.PropTypes = {
  actions: PropTypes.object,
  user: PropTypes.object,
  title: PropTypes.string,
  questions: PropTypes.array,
  calendar: PropTypes.object,
  time: PropTypes.objectOf(PropTypes.number),
  paper: PropTypes.object,
  saved: PropTypes.boolean
}

Editor.defaultProps = {
  paper: null
};

export default Editor;
