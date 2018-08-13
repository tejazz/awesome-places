import { SET_PLACES, REMOVE_PLACE } from './actionTypes';
import { uiStartLoading, uiStopLoading } from './index';

// stores the image first and then stores the image address
// in the next call made
export const addPlace = (placeName, location, image) => {
    return dispatch => {
        dispatch(uiStartLoading());
        fetch('https://us-central1-rncourseapp-1532522809465.cloudfunctions.net/storeImage', {
            method: 'POST',
            body: JSON.stringify({
                image: image.base64
            })
        })
            .catch(err => {
                alert("Something went wrong. Please try again.");
                dispatch(uiStopLoading());
            })
            .then(res => res.json())
            .then(parsedRes => {
                const placeData = {
                    name: placeName,
                    location: location,
                    image: parsedRes.imageUrl
                };
                return fetch("https://rncourseapp-1532522809465.firebaseio.com/places.json", {
                    method: "POST",
                    body: JSON.stringify(placeData)
                })
                    .catch(err => {
                        alert("Something went wrong. Please try again.");
                        dispatch(uiStopLoading());
                    })
                    .then(res => res.json())
                    .then(parsedRes => {
                        console.log(parsedRes);
                        dispatch(uiStopLoading());
                    });
            });
    };
};

export const getPlaces = () => {
    return dispatch => {
        fetch("https://rncourseapp-1532522809465.firebaseio.com/places.json")
            .catch(err => {
                alert("Something went wrong. We are sorry.");
                console.log(err);
            })
            .then(res => res.json())
            .then(parsedRes => {
                const places = [];
                for (let key in parsedRes) {
                    places.push({
                        ...parsedRes[key],
                        image: {
                            uri: parsedRes[key].image
                        },
                        key: key
                    })
                }

                dispatch(setPlaces(places));
            });
    };
};

export const setPlaces = (places) => {
    return {
        type: SET_PLACES,
        places: places
    };
};

export const deletePlace = (key) => {
    return dispatch => {
        dispatch(removePlace(key));
        fetch("https://rncourseapp-1532522809465.firebaseio.com/places/" + key + ".json", {
            method: "DELETE"
        })
            .catch(err => {
                alert("Something went wrong. We are sorry.");
                console.log(err);
            })
            .then(res => res.json())
            .then(parsedRes => {
                console.log("Done!");
            });
    };
};

export const removePlace = key => {
    return {
        type: REMOVE_PLACE,
        key: key
    };
};