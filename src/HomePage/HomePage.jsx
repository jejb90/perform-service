import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { entrustActions } from '../_actions/entrust.actions';

class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ruta: {
                direccion1: '',
                direccion2: '',
                tiempo: '',
                kilometros: ''
            },
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event) {
        const { name, value } = event.target;
        const { ruta } = this.state;
        this.setState({
            ruta: {
                ...ruta,
                [name]: value
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        this.setState({ submitted: true });
        const { ruta } = this.state;
        const { dispatch } = this.props;
        if (ruta.direccion1
            && ruta.direccion2 && ruta.tiempo && ruta.kilometros) {
            dispatch(entrustActions.register(ruta));
            // dispatch(entrustActions.google(ruta));

        }
    }

    render() {
        const { registering  } = this.props;
        const { ruta, submitted } = this.state;
        return (
            <div className="col-md-6 col-md-offset-3">
                <p>Registrar el Servicio</p>

                <form name="form" onSubmit={this.handleSubmit}>
                    <div className={'form-group' + (submitted && !ruta.direccion1 ? ' has-error' : '')}>
                        <label htmlFor="firstName">Origen</label>
                        <input type="text" className="form-control" name="direccion1" value={ruta.direccion1} onChange={this.handleChange} />
                        {submitted && !ruta.direccion1 &&
                        <div className="help-block">Origen es requerido</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !ruta.direccion2 ? ' has-error' : '')}>
                        <label htmlFor="lastName">Destino</label>
                        <input type="text" className="form-control" name="direccion2" value={ruta.direccion2} onChange={this.handleChange} />
                        {submitted && !ruta.direccion2 &&
                        <div className="help-block">Destino es requerido</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !ruta.tiempo ? ' has-error' : '')}>
                        <label htmlFor="username">Tiempo</label>
                        <input type="text" className="form-control" name="tiempo" value={ruta.tiempo} onChange={this.handleChange} />
                        {submitted && !ruta.tiempo &&
                        <div className="help-block">Tiempo es requerido</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !ruta.kilometros ? ' has-error' : '')}>
                        <label htmlFor="password">Kilometros</label>
                        <input type="text" className="form-control" name="kilometros" value={ruta.kilometros} onChange={this.handleChange} />
                        {submitted && !ruta.kilometros &&
                        <div className="help-block">kilometros es requerido</div>
                        }
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary">Registrar</button>
                        {registering &&
                        <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                        }
                        <Link to="/login" className="btn btn-link">Cancelar</Link>
                    </div>
                </form>

            </div>
        );
    }
}

function mapStateToProps(state) {
    const { users, authentication } = state;
    const { user } = authentication;
    return {
        user,
        users
    };
}

const connectedHomePage = connect(mapStateToProps)(HomePage);
export { connectedHomePage as HomePage };