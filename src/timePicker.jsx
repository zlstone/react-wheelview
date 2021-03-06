/**
* @Author: zhao lei <leozhao>
* @Date:   2016-05-24T16:12:35+08:00
* @Email:  leozhao.go@gmail.com
* @Last modified by:   leozhao
* @Last modified time: 2016-05-27T17:59:21+08:00
*/



import React, {Component} from 'react'
import styles from './index.less'

export default class TimePicker extends Component {
  constructor(data) {
    super();
    const { hour, minute } = data;
    this.state = {
      hour: hour || 0,
      minute: minute || 0,
      hourTop: hour ? -hour * 32 : 0,
      minuteTop: minute ? -minute * 32 : 0
    }
  }

  componentWillReceiveProps (nextProps) {
    const { hour, minute } = nextProps;
    this.setState({
      hour: hour || 0,
      minute: minute || 0,
      hourTop: hour ? -hour * 32 : 0,
      minuteTop: minute ? -minute * 32 : 0
    })
  }

  clickHandle () {
    this.props.getPickedData(`${('0'+this.state.hour).slice(-2)}:${('0'+this.state.minute).slice(-2)}`);
  }

  touchStart (ev) {
    // console.log('start');
    const { pageX, pageY } = ev.targetTouches[0];
    this.startX = pageX;
    this.startY = pageY;
    if( pageX > window.innerWidth / 2 ){
      this.type = 'minute';
    } else {
      this.type = 'hour';
    }
  }

  touchMove(ev){
    ev.preventDefault();
    const { pageX, pageY } = ev.targetTouches[0];
    const { hourTop, minuteTop } = this.state;
    let X = pageX - this.startX;
    let Y = pageY - this.startY;
    let speed = Math.abs(Y) < 8 ? 8 : Math.abs(Y);
    let baseTop = this.type === 'hour' ? hourTop : minuteTop;
    let iDistance = -baseTop % 32;

    if ( Math.abs(Y) > Math.abs(X) && Y > 0) {
      let nextTop = baseTop < 0 ? baseTop + speed : 15
      let value = -parseInt( nextTop / 32 );
      // console.log("top 2 bottom");
      if( this.type === 'hour' ){
        this.setState({
          hour: value,
          hourTop: nextTop
        })
      } else {
        this.setState({
          minute: value,
          minuteTop: nextTop
        })
      }
    } else if ( Math.abs(Y) > Math.abs(X) && Y < 0 ) {
      // console.log("bottom 2 top");
      if( this.type === 'hour' ){
        let nextTop = 32 * 23 + baseTop > speed ? baseTop - speed : -32 * 23 - 15;
        let value = -parseInt( nextTop / 32 );
        this.setState({
          hour: value,
          hourTop: nextTop
        })
      } else {
        let nextTop = 32 * 59 + baseTop > speed ? baseTop - speed : -32 * 59 - 15;
        let value = -parseInt( nextTop / 32 ) + ( iDistance > 15 ? 1 : 0 );
        this.setState({
          minute: value,
          minuteTop: nextTop
        })
      }
    }
    this.startX = pageX;
    this.startY = pageY;

  }

  touchEnd(){
    const baseTop = this.type === 'hour' ? this.state.hourTop : this.state.minuteTop;
    const iDistance = -baseTop % 32
    const value = -parseInt( baseTop / 32 ) + ( iDistance > 15 ? 1 : 0 )
    // console.log(baseTop, iDistance)

    if ( this.type === 'hour') {
      this.setState({
        hour: value,
        hourTop: value * -32
      });
    } else {
      this.setState({
        minute: value,
        minuteTop: value * -32
      });
    }
  }

  getHours ( isOption ) {
    const { hour } = this.state;
    let temp = [];
    let i = 0;
    while ( i < 24 ) {
      if( isOption ){
        temp.push( <li key={i} className={getClassName(hour,i)}>{('0' + i).slice(-2)}</li> );
      } else {
        temp.push( <li key={i}>{('0' + i).slice(-2)}</li> );
      }
      i++;
    }
    return temp;
  }

  getMinutes ( isOption ) {
    const { minute } = this.state;
    let temp = [];
    let i = 0;
    while ( i < 60 ) {
      if( isOption ){
        temp.push( <li key={i} className={getClassName(minute,i)}>{('0' + i).slice(-2)}</li> );
      } else {
        temp.push( <li key={i}>{('0' + i).slice(-2)}</li> );
      }
      i++;
    }
    return temp;
  }

  render () {

    return (
      <div className={styles.timepicker} style={{transform: 'translateY(' + (this.props.wheelviewDisplay ? 0 : '120%') + ')'}}  onTouchStart={this.touchStart.bind(this)} onTouchMove={this.touchMove.bind(this)} onTouchEnd={this.touchEnd.bind(this)}>
        <div className={styles.optionPicker}>
          <ul
            className={styles.hoursList}
            style={{transform: 'translateY('+ ( this.state.hourTop + 32 * 3 ) + 'px)'}}
          >{this.getHours(true)}</ul>
          <ul
            className={styles.minutesList}
            style={{transform: 'translateY(' + ( this.state.minuteTop + 32 * 3 ) + 'px)'}}
          >{this.getMinutes(true)}</ul>
        </div>
        <div className={styles.maskPicker}></div>
        <div className={styles.currentPicker}>
          <ul
            className={styles.hoursList}
            style={{transform: 'translateY('+this.state.hourTop+'px)'}}
          >{this.getHours()}</ul>
          <ul
            className={styles.minutesList}
            style={{transform: 'translateY('+this.state.minuteTop+'px)'}}
          >{this.getMinutes()}</ul>
          <span className={styles.hourMark}>时</span>
          <span className={styles.minuteMark}>分</span>
        </div>
        <button className={styles.button} onClick={this.clickHandle.bind(this)}>确&nbsp;定</button>
      </div>
    )
  }
}

function getClassName(current, index) {
  if( current === index ){
    return styles.beside;
  }
  if( current - 1 === index || current + 1 === index ){
    return styles.beside;
  }
  if( current - 2 === index || current + 2 === index ){
    return styles.behind;
  }
  return '';
}
