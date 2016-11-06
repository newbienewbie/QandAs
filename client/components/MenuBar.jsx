import React, { Component, PropTypes } from 'react';
import '../scss/menu.scss';
import { Link } from 'react-router';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import ActionHome from 'material-ui/svg-icons/action/home';
import ActionPermIdentity from 'material-ui/svg-icons/action/perm-identity';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import ActionPowerSettingsNew from 'material-ui/svg-icons/action/power-settings-new';
import MenuOpener from './MenuOpener.jsx';
import Settings from '../containers/Settings';

class MenuBar extends Component {
  handleClick = (event) => {
    this.props.actions.handleMenuOpen(event.currentTarget);
  }
  changeSettings = () => {
    this.props.actions.closeSettings();
  }
  render () {
    const { actions, isOpen, anchorEl, settingsVisible } = this.props;
    const { handleMenuClose, openSettings, closeSettings } = actions;
    const dialogActions = [
      <FlatButton
        keyboardFocused={true}
        label="确定"
        onTouchTap={this.changeSettings}
      />,
      <FlatButton
        label="取消"
        onTouchTap={closeSettings}
      />
    ];
    return (
      <div>
        <MenuOpener isOpen={isOpen} handleClick={this.handleClick} />
        <Drawer open={isOpen} docked={false} onRequestChange={handleMenuClose}>
          <AppBar title='功能' />
          <Menu onClick={handleMenuClose}>
            <MenuItem leftIcon={<ActionHome />}>
              <Link className="insideLink" to={'/'}>主页</Link>
            </MenuItem>
            <MenuItem leftIcon={<ActionPermIdentity />}>
              <Link className="insideLink" to={'/profile'}>用户资料</Link>
            </MenuItem>
            <MenuItem leftIcon={<ActionSettings />} onTouchTap={openSettings}>
              设置
            </MenuItem>
            <MenuItem leftIcon={<ActionPowerSettingsNew />}>
              <Link className="insideLink" to={'/signIn'}>退出</Link>
            </MenuItem>
          </Menu>
        </Drawer>
        <Dialog
          open={settingsVisible}
          actions={dialogActions}
          onRequestClose={closeSettings}
        >
          <Settings />
        </Dialog>
      </div>
    );
  }
}

MenuBar.PropTypes = {
  isOpen: PropTypes.boolean,
  anchorEl: PropTypes.object,
  settingsVisible: PropTypes.boolean,
  actions: PropTypes.object
};

export default MenuBar;
