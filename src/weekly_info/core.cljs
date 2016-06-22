(ns weekly-info.core
  (:require [reagent.core :as reagent :refer [atom]]
            [cljsjs.c3]
            [cljsjs.d3]
            [goog.string :as gstring]
            [goog.string.format]
            [cljs.pprint :refer [cl-format]]))

(enable-console-print!)

(println "This text is printed from src/iibc-info/core.cljs. Go ahead and edit it and see reloading in action.")

;; define your app data so that it doesn't get over-written on reload

(def app-state
  (atom {:text "Hello world!"
         :date (js/Date.)
         :offerings {:wg 1165160 :wm 50000 :ws 800000 :wt 2004000
                     :mg 1650000 :mm 170000 :ms 900000 :mt 2746000
                     :yg 41540000 :ym 5191000 :ys 1120000 :yt 47851000}}))

(def c3-offering-trend
  {:bindto "#graph1"
   :size {:height 300}
   :data {:x "Date"
          :url "offering.csv"
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
          :url "income_spending.csv"
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

;; weekly offering info -----------------------------------------------
(reagent/render-component [offering-info (get-amount :wg)]
                          (. js/document (getElementById "w-general")))
(reagent/render-component [offering-info (get-amount :mg)]
                          (. js/document (getElementById "m-general")))
(reagent/render-component [offering-info (get-amount :yg)]
                          (. js/document (getElementById "y-general")))
(reagent/render-component [offering-info (get-amount :wm)]
                          (. js/document (getElementById "w-mission")))
(reagent/render-component [offering-info (get-amount :mm)]
                          (. js/document (getElementById "m-mission")))
(reagent/render-component [offering-info (get-amount :ym)]
                          (. js/document (getElementById "y-mission")))
(reagent/render-component [offering-info (get-amount :ws)]
                          (. js/document (getElementById "w-special")))
(reagent/render-component [offering-info (get-amount :ms)]
                          (. js/document (getElementById "m-special")))
(reagent/render-component [offering-info (get-amount :ys)]
                          (. js/document (getElementById "y-special")))
(reagent/render-component [offering-info (get-amount :wt)]
                          (. js/document (getElementById "w-total")))
(reagent/render-component [offering-info (get-amount :mt)]
                          (. js/document (getElementById "m-total")))
(reagent/render-component [offering-info (get-amount :yt)]
                          (. js/document (getElementById "y-total")))

;; monthly offering trend chart --------------------------------------
(.generate js/c3 (clj->js c3-offering-trend))
(.generate js/c3 (clj->js c3-income-spending))

(defn on-js-reload []
  ;; optionally touch your app-state to force rerendering depending on
  ;; your application
  ;; (swap! app-state update-in [:__figwheel_counter] inc)
)
