

function genRand(max, seed, i) {
  const rng = new Math.seedrandom(`${i}${seed}${max - i}`);
  return Math.floor(rng() * Math.floor(max));
}

function genNumList(min, max, list, seed) {
  for (var i = min; i <= max; i++) list.push(i);
  for (var i = 0; i < max; i++) {
    const x = genRand(max - 1, seed, i);
    const y = genRand(max - 1, seed, max - i);
    const b = list[x];
    list[x] = list[y];
    list[y] = b;
  }
  return list;
}

function genGroupsFromList(groups, numList, groupsOf, seed) {
  if (numList.length <= 0) {
    groups = [];
    return groups;
  } else if (groupsOf <= 0 || numList.length < groupsOf) {
    groups = [numList];
    return groups;
  }

  while (numList.length >= groupsOf) {
    const group = [];
    for (var i = 0; i < groupsOf; i++) {
      group.push(numList.splice(genRand(numList.length - 1, seed, i), 1));
    }
    groups.push(group);
  }

  while (numList.length > 0) {
    groups[genRand(groups.length - 1, seed, numList.length)].push(numList.pop());
  }

  return groups;
}

function initGroups(numPeople, groupsOf, seed) {
  const numList = genNumList(1, numPeople, [], seed);
  const groups = genGroupsFromList([], numList, groupsOf, seed);

  return groups.map((group, i) => {
    return {
      display: group.join(', '), 
      over: (group.length > groupsOf)
    };
  });
}

function data() {
  return {
    numPeople: 0,
    groupsOf: 0,
    seed: 'three horned girbat',
    groups: [],
    init() {
      if (window.location.hash) {
        [this.numPeople, this.groupsOf, this.seed] = decodeURIComponent(window.location.hash.substr(1)).split('|');
        this.groups = initGroups(this.numPeople, this.groupsOf, this.seed);
      }
    },
    generate(e) {
      e.preventDefault();
      window.location.hash = `${this.numPeople}|${this.groupsOf}|${this.seed}`;
      this.init();
    }
  }
}