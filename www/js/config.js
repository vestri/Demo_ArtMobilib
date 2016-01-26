config =
{
  "contents":
  [
    {
      "uuid": "Rock",
      "name": "Rock",
      "object": "rock"
    },
    {
      "uuid": "Cube",
      "name": "Cube",
      "object": "cube_mesh"
    },
    {
      "uuid": "Monster",
      "name": "Monster",
      "object": "monster"
    },
    {
      "uuid": "banana",
      "name": "Banana",
      "object": "plane_banana"
    },
    {
      "uuid": "lehublot",
      "name": "Le Hublot",
      "object": "plane_lehublot"
    },
    {
      "uuid": "coconut",
      "name": "Coconut",
      "object": "plane_coconut"
    }
  ],
  "markers":
  [
    {
      "uuid": "marker_tag",
      "name": "Tag Aruco",
      "url": "assets/markers/tag.jpg",
      "is_tag": true,
      "tag_id": 1001
    },
    {
      "uuid": "marker_3Dtricart",
      "name": "Marker image 1",
      "url": "assets/markers/3Dtricart.jpg"
    },
    {
      "uuid": "marker_vsd",
      "name": "Marker image 2",
      "url": "assets/markers/vsd.jpg"
    },
    {
      "uuid": "tag2",
      "name": "Tag draw",
      "url": "assets/markers/tag2.jpg"
    },
    {
      "uuid": "tag3",
      "name": "Tag AR",
      "url": "assets/markers/tag3.jpg"
    },
    {
      "uuid": "tag4",
      "name": "Tag squares",
      "url": "assets/markers/tag4.jpg"
    },
    {
      "uuid": "tag5",
      "name": "Tag Space Invaders",
      "url": "assets/markers/tag5.jpg"
    }
  ],
  "channels":
  [
    {
      "name": "Channel preset 1",
      "marker": "marker_3Dtricart",
      "contents": [
        {
          "uuid": "Cube"
        },
        {
          "uuid": "contents_empty_2"
        }
      ]
    },
    {
      "name": "Channel preset 2",
      "marker": "marker_tag",
      "contents": [
        {
          "uuid": "Monster"
        },
        {
          "uuid": "Rock"
        }
      ]
    }
  ]
};