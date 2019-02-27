import React from 'react';
import PropTypes from 'prop-types';

import style from './DataPicker.scss'


class DataPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDay: '',
            currentMonth: '',
            currentYear: '',
            weekList: [
                {name: '日', className: 'normal'},
                {name: '一', className: 'normal'},
                {name: '二', className: 'normal'},
                {name: '三', className: 'normal'},
                {name: '四', className: 'normal'},
                {name: '五', className: 'normal'},
                {name: '六', className: 'normal'}
            ],
            dayList: []
        };

        this.initCalendar = this.initCalendar.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.renderBody = this.renderBody.bind(this);
        this.preMonth = this.preMonth.bind(this);
        this.nextMonth = this.nextMonth.bind(this);
        this.getDateString = this.getDateString.bind(this);
        this.getMonthDayNumber = this.getMonthDayNumber.bind(this);
    }

    componentWillMount() {
        // style.use() // 需要配置loader 可以直接注释 忽略掉  实现每个模块卸载之后 css也会销毁 可以看之前写的一篇react css局部作用域的文章
    }

    componentWillUnmount() {
        // style.unuse() // 需要配置loader 可以直接注释 忽略掉 实现每个模块卸载之后 css也会销毁 可以看之前写的一篇react css局部作用域的文章
    }

    componentDidMount() {
        this.initCalendar()
    }

    // 获取当前date的当月第一天的字符串形式
    static getMonthFirstDate(date) {
        let nowYear = date.getFullYear(); // 获取年份
        let nowMonth = date.getMonth() + 1; // 获取月份
        return `${nowYear}-${nowMonth}-01`
    }

    // 获取当前date的字符串形式
    getDateString(date) {
        let nowYear = date.getFullYear(); // 获取年份
        let nowMonth = date.getMonth() + 1; // 获取月份
        let day = date.getDate();
        day = day < 10 ? '0' + day : day;
        return `${nowYear}-${nowMonth}-${day}`
    }

    getMonthDayNumber(year, month) {
        let days = 0;
        switch (month) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                days = 31;
                break;
            case 4:
            case 6:
            case 9:
            case 11:
                days = 30;
                break;
            case 2:
                if (year / 400 === 0) {
                    days = 29;
                } else {
                    days = 28;
                }
                break;
            default:
                break;
        }


        return days;
    }

    // 上个月
    preMonth() {
        let date = new Date(`${this.state.currentYear}-${this.state.currentMonth}-${this.state.currentDay}`);
        let preMonthFirstDate = new Date(DataPicker.getMonthFirstDate(new Date(date.setDate(0)))); // 0 是上个月最后一天
        this.initCalendar(preMonthFirstDate)
    }

    // 下个月
    nextMonth() {
        let date = new Date(`${this.state.currentYear}-${this.state.currentMonth}-${this.state.currentDay}`);
        let nextMonthFirstDate = new Date(DataPicker.getMonthFirstDate(new Date(date.setDate(33))));
        this.initCalendar(nextMonthFirstDate)
    }

    // 初始化日历
    initCalendar(currentDate) {

        let nowDate = currentDate ? currentDate : new Date();
        let nowMonthFirstDate = DataPicker.getMonthFirstDate(nowDate); // 获取当月1号日期
        let nowWeek = new Date(nowMonthFirstDate).getDay() ? new Date(nowMonthFirstDate).getDay() : 7; // 获取星期
        let newDateList = []; // 创建日期数组
        let curMonthDays = this.getMonthDayNumber(nowDate.getFullYear(), nowDate.getMonth() + 1);
        // let showDayLength = nowWeek <= 6 ? 35 : 42;  // 显示的总天数  如果5行能显示下一个月 就只显示5行
        let showDayLength = 42;
        let startDay = 1 - nowWeek;

        for (let i = startDay; i < startDay + showDayLength; i++) {
            let date = new Date(new Date(nowMonthFirstDate).setDate(i)); // 获取时间对象
            let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(); // 小于9的数字前面加0
            let dayObject = {
                date: this.getDateString(date),
                day,
                className: '',
            };
            if (i <= 0) {
                dayObject.className = 'pre'
            } else if (i > curMonthDays) {
                dayObject.className = 'next'
            } else {
                dayObject.className = 'normal'
            }
            // new Date(str).toDateString() === new Date().toDateString()
            if (date.toDateString() === new Date().toDateString()) {
                dayObject.className = 'today'
            }
            newDateList.push(dayObject)
        }


        this.setState((pre) => {
            return {
                dayList: newDateList,
                currentDay: nowDate.getDate(),
                currentMonth: nowDate.getMonth() + 1 >= 10 ? nowDate.getMonth() + 1 : '0' + (nowDate.getMonth() + 1),
                currentYear: nowDate.getFullYear(),
            }
        })

    }

    renderHeader() {
        return (
                <div className={style["calendar-header"]}>
                    <div className={style["calendar-header-left"]}>
                        <button onClick={this.preMonth}>上个月</button>
                    </div>
                    <div className=''>
                        {this.state.currentYear}年{this.state.currentMonth}月
                    </div>
                    <div className={style["calendar-header-right"]}>
                        <button onClick={this.nextMonth}>下个月</button>
                    </div>
                </div>
        )
    }

    renderBody() {
        return (
                <div className={style["calendar-body"]}>
                    <div className={style["week-container"]}>
                        {this.state.weekList.map(week => {
                            return <div key={week.name} className={style[week.className]}>{week.name}</div>
                        })}
                    </div>
                    <div className={style["day-container"]}>
                        {this.state.dayList.map((dayObject, index) => {
                            return <div key={index} className={style[dayObject.className]}>{dayObject.day}</div>
                        })}
                    </div>
                </div>
        )
    }

    render() {
        return (
                <div className={style.calendar}>
                    {this.renderHeader()}
                    {this.renderBody()}
                </div>
        )
    }


}

export default DataPicker