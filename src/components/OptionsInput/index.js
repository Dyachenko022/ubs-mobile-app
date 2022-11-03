import React, { Component } from 'react';
import {
    Text,
    TouchableHighlight,
    TextInput,
    Platform,
    View
} from 'react-native';
import PropTypes from 'prop-types';

import CustomStyleSheet from "../../resources/customStyleSheet";

export default class OptionsInput extends Component {

    static propTypes = {
        onSelect: PropTypes.func.isRequired,
        onUnselect: PropTypes.func.isRequired,
        maxSelect: PropTypes.number,
        focused: PropTypes.number,
        options: PropTypes.array
    }

    constructor(props) {
        super(props);
        this.state = {
            count: 0
        };
    }

    static get defaultProps() {
        return {
            onSelect: () => { },
            onUnselect: () => { },
            maxSelect: 1,
            focused: -1,
            options: []
        };
    }

    handlePress(o) {
        if (this.o.selected) {
            this.props.onUnselect(i);
            this.setState({count : this.state.count - 1});
        } else if (this.state.count != this.props.maxSelected){
            this.setState({count : this.state.count + 1});
            this.props.onSelect(i);
        }
    }

    unCheck(i) {
        this.props.onUnselect(i);
    }

    render() {
        return (
            <View style={this.props.style}>
                <Text style={styles.optionTitle} >{this.props.title}</Text>
                <View style={styles.optionsContainer}>
                    {
                        this.props.options.map((o, i) => {
                            let maxSize = this.props.options.length - 1;
                            let style = {};
                            if (i == 0) {
                                style = {
                                    borderTopLeftRadius: 10,
                                    borderBottomLeftRadius: 10,
                                    borderRightWidth: 1,
                                }
                            } else if (i == maxSize) {
                                style = {
                                    borderTopRightRadius: 10,
                                    borderBottomRightRadius: 10,
                                    borderLeftWidth: 1,
                                    borderRightWidth: 1,
                                }
                            } else if (i != 0) {
                                style = {
                                    borderLeftWidth: 1,
                                    borderRightWidth: 0
                                }
                            }
                            return (
                                <TouchableHighlight key={i} activeOpacity={0.6}
                                    underlayColor={'transparent'}
                                    onPress={(o) => { o.selected ? this.unCheck(o) : this.check(o) }}>
                                    <View style={[styles.container, style,
                                    {
                                        borderColor: o.selected ? '#2196F3' : 'grey',
                                        backgroundColor: o.selected ? 'orange' : 'transparent'
                                    }
                                    ]} >
                                        <Text style={[styles.option, { color: o.selected ? 'black' : 'gray' }]}>
                                            {o.text}
                                        </Text>
                                    </View>
                                </TouchableHighlight>
                            )
                        })
                    }
                </View>
            </View>
        );
    }
}

const styles = CustomStyleSheet({
    optionTitle: {
        fontSize: 14,
        lineHeight: 14,
        color: 'rgba(0,0,0,0.5)',
        marginBottom: 4
    },
    container: {
        borderWidth: 1,
    },
    optionsContainer: {
        flexDirection: 'row'
    },
    option: {
        marginHorizontal: 16,
        marginVertical: 8,
        fontWeight: '500',
        fontSize: 16,
        lineHeight: 20,
        color: 'rgba(0,0,0,0.1)',
    },
})