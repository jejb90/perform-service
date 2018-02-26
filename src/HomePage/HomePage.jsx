import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

import {entrustActions} from '../_actions/entrust.actions';

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
        this.calculateDistanceB = this.calculateDistanceB.bind(this);
        this.geocoder = this.geocoder.bind(this);
        this.callback = this.callback.bind(this);
    }

    handleChange(event) {
        const {name, value} = event.target;
        const {ruta} = this.state;
        this.setState({
            ruta: {
                ...ruta,
                [name]: value
            }
        }, this.calculateDistanceB);
    }

    calculateDistanceB() {

        const {ruta} = this.state;
        if (ruta.direccion1 != '' && ruta.direccion2 != '') {
            this.calculateDistance(ruta.direccion1, ruta.direccion2)
        }

    }

    handleSubmit(event) {
        event.preventDefault();

        this.setState({submitted: true});
        const {ruta} = this.state;
        const {dispatch} = this.props;
        ruta.kilometros = $('#kilometros').val();
        ruta.tiempo = $('#tiempo').val();

        if (ruta.direccion1
            && ruta.direccion2
            && ruta.kilometros
            && ruta.tiempo
        ) {
            dispatch(entrustActions.register(ruta));

        }
    }

    calculateDistance(origin, destination) {
        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
            {
                origins: [origin],
                destinations: [destination],
                travelMode: google.maps.TravelMode.DRIVING,
                avoidHighways: false,
                avoidTolls: false
            }, this.callback);
    }

    geocoder() {


        const {ruta} = this.state;
        var geocoder = new google.maps.Geocoder();
        console.log()
        var cor1 = '';
        var mapOptions = {
            center: new google.maps.LatLng(4.6482836,-74.2482387),
            zoom: 6,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        if (ruta.direccion1 != '') {
            geocoder.geocode({'address': ruta.direccion1}, function (results, status) {
                if (status == 'OK') {
                    var place = new google.maps.LatLng(results[0].geometry.location.lat()
                        , results[0].geometry.location.lng());
                    var marker = new google.maps.Marker({
                        position: place
                        , title: ruta.direccion1
                        , map: map
                        ,
                    });
                }
            });
        }

        if (ruta.direccion2 != '') {
            geocoder.geocode({'address': ruta.direccion2}, function (results, status) {
                if (status == 'OK') {
                    var place = new google.maps.LatLng(results[0].geometry.location.lat()
                        , results[0].geometry.location.lng());
                    var marker = new google.maps.Marker({
                        position: place
                        , title: ruta.direccion2
                        , map: map
                        ,
                    });
                }
            });
        }
    }

    callback(response, status) {
        if (status != google.maps.DistanceMatrixStatus.OK) {
            $('#result').html(err);
        } else {
            if (response.rows[0].elements[0].status === "ZERO_RESULTS" || response.rows[0].elements[0].status === "NOT_FOUND") {
                $('#kilometros').val('');
                $('#tiempo').val('');

            } else {
                // return response.rows[0].elements[0];
                $('#kilometros').val(response.rows[0].elements[0].distance.text);
                $('#tiempo').val((response.rows[0].elements[0].duration.text));
                this.geocoder()
            }
        }
    }

    render() {
        const {registering} = this.props;
        const {ruta, submitted} = this.state;
        return (
            <div className="row">
                <div className="col-md-6">
                    <p>Registrar el Servicio</p>

                    <form name="form" onSubmit={this.handleSubmit}>
                        <div className={'form-group' + (submitted && !ruta.direccion1 ? ' has-error' : '')}>
                            <label htmlFor="firstName">Origen</label>
                            <input type="text" className="form-control" name="direccion1" value={ruta.direccion1}
                                   onChange={this.handleChange}/>
                            {submitted && !ruta.direccion1 &&
                            <div className="help-block">Origen es requerido</div>
                            }
                        </div>
                        <div className={'form-group' + (submitted && !ruta.direccion2 ? ' has-error' : '')}>
                            <label htmlFor="lastName">Destino</label>
                            <input type="text" className="form-control" name="direccion2" value={ruta.direccion2}
                                   onChange={this.handleChange}/>
                            {submitted && !ruta.direccion2 &&
                            <div className="help-block">Destino es requerido</div>
                            }
                        </div>
                        <div className={'form-group' + (submitted && !ruta.tiempo ? ' has-error' : '')}>
                            <label htmlFor="username">Tiempo</label>
                            <input type="text" className="form-control" disabled={true}
                                   id="tiempo" name="tiempo" value={ruta.tiempo}
                                   onChange={this.handleChange}/>
                            {submitted && !ruta.tiempo &&
                            <div className="help-block">Tiempo es requerido</div>
                            }
                        </div>
                        <div className={'form-group' + (submitted && !ruta.kilometros ? ' has-error' : '')}>
                            <label htmlFor="password">Kilometros</label>
                            <input type="text" className="form-control" disabled={true} id="kilometros"
                                   name="kilometros"
                                   value={ruta.kilometros} onChange={this.handleChange}/>
                            {submitted && !ruta.kilometros &&
                            <div className="help-block">kilometros es requerido</div>
                            }
                        </div>
                        <div className="form-group">
                            <button className="btn btn-primary">Registrar</button>
                            {registering &&
                            <img
                                src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="/>
                            }
                            <Link to="/login" className="btn btn-link">Cancelar</Link>
                        </div>
                    </form>

                </div>

                <div className="col-md-6" id="map"></div>

            </div>
        );
    }
}

function

mapStateToProps(state) {
    const {users, authentication} = state;
    const {user} = authentication;
    return {
        user,
        users
    };
}

const
    connectedHomePage = connect(mapStateToProps)(HomePage);
export {
    connectedHomePage
        as
            HomePage
}
    ;