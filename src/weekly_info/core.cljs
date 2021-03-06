(ns weekly-info.core
  (:require [reagent.core :as reagent :refer [atom]]
            [cljsjs.c3]
            [cljsjs.d3]
            [goog.string :as gstring]
            [goog.string.format]
            [cljs.pprint :refer [cl-format]]))

(enable-console-print!)

;; define your app data so that it doesn't get over-written on reload

(def app-state
  (atom {:date "2016-06-12"
         :offerings {:wg 1165160 :wm 50000 :ws 800000 :wt 2004000
                     :mg 1650000 :mm 170000 :ms 900000 :mt 2746000
                     :yg 41540000 :ym 5191000 :ys 1120000 :yt 47851000}}))

(def c3-offering-trend
  {:bindto "#graph1"
   :size {:height 300}
   :data {:x "Date"
          :url "https://raw.githubusercontent.com/Hohyun/weekly-info/master/resources/public/offering_trend.csv"
          :type "spline"
          :types {:General "area-spline" :Mission "area-spline" :Special "area-spline"}
          :groups [["General" "Mission" "Special"]]}
   :axis {:x {:type "timeseries"
              :tick {:format "%Y-%m"}}
          :y {:tick {:format (.format js/d3 "s")}}}
   :zoom {:enabled true}
   :tooltip {:format {:title (.format js/d3.time "%Y-%m") 
                      :value (.format js/d3 ",")}}
   :grid {:y {:show false
              :lines [{:value 10000000 :text "10M"}
                      {:value 8000000 :text "8M"}
                      {:value 6000000 :text "6M"}]}}})

(def c3-income-spending
  {:bindto "#graph2"
   :size {:height 280}
   :data {:x "Month"
          :url "https://raw.githubusercontent.com/Hohyun/weekly-info/master/resources/public/income_spending.csv"
          :type "bar"
          :groups [["Offering"]
                   ["Expense"]
                   ["Net"]]}
   :axis {:x {:type "category"}
          :y {:tick {:format (.format js/d3 "s")}}}
   :zoom {:enabled true}
   :tooltip {:format {:value (.format js/d3 ",")}}
   :grid {:y {:lines [{:value 10000000 :text "10M"}
                      {:value 8000000 :text "8M"}
                      {:value 0 :text "0"}
                      {:value -2000000 :text "-2M"}]}}})

(defn get-amount [key]
  (get-in @app-state [:offerings key]))

(defn offering-info [amount]
  [:span (cl-format nil "~:d" amount)])

;; monthly offering trend chart --------------------------------------
(.generate js/c3 (clj->js c3-offering-trend))
(.generate js/c3 (clj->js c3-income-spending))

(defn on-js-reload []
  ;; optionally touch your app-state to force rerendering depending on
  ;; your application
  ;; (swap! app-state update-in [:__figwheel_counter] inc)
)
