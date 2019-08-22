import { Component, OnInit } from '@angular/core';
import { AmplifyService } from 'aws-amplify-angular';
//import { API, graphqlOperation } from 'aws-amplify';
//import { listRestaurants } from '../../graphql/queries';
import Auth from '@aws-amplify/auth';
import PubSub from '@aws-amplify/pubsub';

import { APIService } from '../API.service';
import { Restaurant } from './../types/restaurant';

import * as Observable from 'zen-observable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import { createRestaurant } from '../../graphql/mutations';
//import { onCreateRestaurant } from '../../graphql/subscriptions';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title = 'amplify-app';
  restaurants: Array<Restaurant>;
  loading = true;
  public createForm: FormGroup;

  constructor(
    public api: APIService,
    private fb: FormBuilder
  ) {
    Auth.currentAuthenticatedUser().then(console.log)
  }
  ngOnInit() {
    this.createForm = this.fb.group({
      'name': ['', Validators.required],
      'description': ['', Validators.required],
      'city': ['', Validators.required]
    });

    this.loading = true;

    this.api.ListRestaurants().then(event => {
      this.loading = false;
      this.restaurants = event.items;
    });

    //Subscribe to changes
    this.api.OnCreateRestaurantListener.subscribe(event => {
      const newRestaurant = event.value.data.onCreateRestaurant;
      this.restaurants = [newRestaurant, ...this.restaurants];
    });
  }
  
  public onCreate(restaurant: any) {
    this.api.CreateRestaurant(restaurant).then(event => {
      console.log('item created!');
      this.createForm.reset();
    })
    .catch(e => {
      console.log('error creating restaurant...', e);
    });
  }
}