import { connect } from 'react-redux';
import {actions} from './actions'

function smart(mapStateToProps, mapDispatchToProps) {
  return connect(
    (state, ownProps) => {
      return mapStateToProps(state, ownProps);
    },
    null,
    props => {
      if (mapDispatchToProps) {
        return Object.assign({}, props, mapDispatchToProps(actions, props));
      }
      return { ...props };
    }
  );
}

export default smart;