from rulr.Utils.AutoGroup import *
from rulr.Utils.Viewable import *

def nodePathToString(nodePath):
	return '/'.join([str(id) for id in nodePath])