class Utils(object):

    @staticmethod
    def objNoneCheck(obj, defaultVal):
        """
        this method is used instead of checking if an object is none and then givving it a default value
        Args:
            obj: the object in question
            defaultVal: the default value for the object

        Returns: default value if object is None, otherwise returns the object

        """
        if obj is None:
            return defaultVal
        else:
            return obj

    @staticmethod
    def dictNoneCheck(dictObj, defaultsDict):
        """
        replaces all none existing keys or None values, with the default values
        Args:
            dictObj: the dictionary in question
            defaultsDict: the default key/values for the dictionary

        Returns: a dictionary with None Values/none existing values replaced with the default vals

        """
        if dictObj is None:
            return defaultsDict

        result = {}
        for key in defaultsDict:
            if key in dictObj:
                result[key] = Utils.objNoneCheck(dictObj[key], defaultsDict[key])
            else:
                result[key] = defaultsDict[key]
        return result
