// *********************************************************************
// MAPBOX STREETS
// *********************************************************************

// =====================================================================
// FONTS
// =====================================================================

// Language
@name: '[name]';

@white_ref: #fff;

Map { font-directory: url("fonts/"); }

// set up font sets for various weights and styles
@sans_lt:           "Roboto Condensed","Arial Unicode MS Regular";
@sans_lt_italic:    "Roboto Condensed Italic","Arial Unicode MS Regular";
@sans:              "Roboto Condensed","Arial Unicode MS Regular";
@sans_bold:         "Roboto Bold Condensed","Arial Unicode MS Regular";
@sans_italic:       "Roboto Condensed Italic","Arial Unicode MS Regular";
@sans_bold_italic:  "Roboto Bold Condensed Italic","Arial Unicode MS Regular";

// =====================================================================
// LANDUSE & LANDCOVER COLORS
// =====================================================================

@land:              #E8E0D8;
@water:             #73B6E6;
@grass:             #b3f68e;
@sand:              #F7ECD2;
@rock:              #D8D7D5;
@park:              #a7fa79;
@cemetery:          #b1f28e;
@wooded:            #3A6;
@industrial:        #DDDCDC;
@agriculture:       #EAE0D0;
@snow:              #EDE5DD;

@building:          darken(@land, 8);
@hospital:          #F2E3E1;
@school:            #F2EAB8;
@pitch:             #CAE6A9;
@sports:            @park;

@parking:           fadeout(@road_fill, 75%);

// =====================================================================
// ROAD COLORS
// =====================================================================

// For each class of road there are three color variables:
// - line: for lower zoomlevels when the road is represented by a
//         single solid line.
// - case: for higher zoomlevels, this color is for the road's
//         casing (outline).
// - fill: for higher zoomlevels, this color is for the road's
//         inner fill (inline).

@motorway_line:     @white_ref;
@motorway_fill:     @white_ref;
@motorway_case:     #000;

@main_line:     @white_ref;
@main_fill:     @white_ref;
@main_case:     #000;

@road_line:     @white_ref;
@road_fill:     @white_ref;
@road_case:     #000;

@pedestrian_line:   @white_ref;
@pedestrian_fill:   @pedestrian_line;
@pedestrian_case:   @road_case;

@path_line:     @white_ref;
@path_fill:     @white_ref;
@path_case:     @land;

@rail_line:     #aaa;
@rail_fill:     @white_ref;
@rail_case:     @land;

@bridge_case:   #999;

@aeroway:       lighten(@industrial,5);

// =====================================================================
// BOUNDARY COLORS
// =====================================================================

@admin_2:           #F892AE;
@admin_3:           #ccc;
@admin_4:           #eee;

// =====================================================================
// LABEL COLORS
// =====================================================================

// We set up a default halo color for places so you can edit them all
// at once or override each individually.
@place_halo:        @white_ref;

@country_text:      @land * 0.2;
@country_halo:      @place_halo;

@state_text:        #666;
@state_halo:        @place_halo;

@city_text:         @land * 0.1;
@city_halo:         @place_halo;

@town_text:         @land * 0.2;
@town_halo:         @place_halo;

@poi_text:          @poi_text;  

@road_text:         #666;
@road_halo:         @white_ref;

@other_text:        darken(@land,50)*0.8;
@other_halo:        @place_halo;

@locality_text:     #aaa;
@locality_halo:     @land;

// Also used for other small places: hamlets, suburbs, localities
@village_text:      #888;
@village_halo:      @place_halo;

@transport_text:    #445;

/**/